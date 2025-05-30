"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Trash2, Plus, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Document {
  id: string
  name: string
  category: string
  uploadDate: string
  file: string | null
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Lý lịch cá nhân",
      category: "personal",
      uploadDate: "2023-05-15",
      file: null,
    },
  ])

  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [newDocument, setNewDocument] = useState<Omit<Document, "id">>({
    name: "",
    category: "personal",
    uploadDate: new Date().toISOString().split("T")[0],
    file: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewDocument({
          ...newDocument,
          file: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddDocument = () => {
    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      setDocuments([
        ...documents,
        {
          ...newDocument,
          id: Date.now().toString(),
        },
      ])

      setNewDocument({
        name: "",
        category: "personal",
        uploadDate: new Date().toISOString().split("T")[0],
        file: null,
      })

      setIsUploading(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "personal", name: "Lý lịch cá nhân" },
    { id: "degree", name: "Bằng cấp" },
    { id: "certificate", name: "Chứng chỉ hành nghề" },
    { id: "vaccination", name: "Phiếu tiêm chủng" },
    { id: "other", name: "Khác" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ nhân sự</h1>
          <p className="text-muted-foreground">Quản lý các tài liệu hồ sơ nhân sự</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm tài liệu mới</DialogTitle>
              <DialogDescription>Nhập thông tin và tải lên tài liệu của bạn</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên tài liệu</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên tài liệu"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                >
                  {categories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tài liệu</Label>
                <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-4">
                  {newDocument.file ? (
                    <div className="relative w-full">
                      <img
                        src={newDocument.file || "/placeholder.svg"}
                        alt="Document preview"
                        className="mx-auto max-h-[200px] rounded-md object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setNewDocument({ ...newDocument, file: null })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Kéo và thả hoặc nhấp để tải lên</p>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn tệp
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDocument} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải lên...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isSuccess && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <AlertDescription>Tài liệu đã được thêm thành công!</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {documents
                .filter((doc) => category.id === "all" || doc.category === category.id)
                .map((document) => (
                  <Card key={document.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      {document.file ? (
                        <img
                          src={document.file || "/placeholder.svg"}
                          alt={document.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{document.name}</CardTitle>
                      <CardDescription>
                        {categories.find((cat) => cat.id === document.category)?.name || "Khác"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Ngày tải lên:</span>
                        <span className="text-sm">{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="destructive"
                        className="ml-auto"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>

            {documents.filter((doc) => category.id === "all" || doc.category === category.id).length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-semibold">Không có tài liệu</h3>
                <p className="mb-4 text-sm text-muted-foreground">Chưa có tài liệu nào trong danh mục này</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm tài liệu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">{/* Dialog content same as above */}</DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
