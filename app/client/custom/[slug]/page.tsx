"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Plus, Trash2, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

// Định nghĩa kiểu dữ liệu cho trường tùy chỉnh
interface CustomField {
  id: string
  name: string
  slug: string
}

// Định nghĩa kiểu dữ liệu cho tài liệu
interface Document {
  id: string
  name: string
  uploadDate: string
  file: string | null
}

export default function ClientCustomFieldPage() {
  const params = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast, currentToast, dismissToast } = useToast()
  const [customField, setCustomField] = useState<CustomField | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDocument, setNewDocument] = useState<Omit<Document, "id">>({
    name: "",
    uploadDate: new Date().toISOString().split("T")[0],
    file: null,
  })

  // Lấy thông tin trường tùy chỉnh từ localStorage
  useEffect(() => {
    const slug = params.slug as string
    const storedFields = localStorage.getItem("customFields")

    if (storedFields) {
      const fields = JSON.parse(storedFields) as CustomField[]
      const field = fields.find((f) => f.slug === slug)

      if (field) {
        setCustomField(field)
      } else {
        // Nếu không tìm thấy trường, chuyển hướng về trang dashboard
        router.push("/client/dashboard")
      }
    }
  }, [params.slug, router])

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
    const document = {
      ...newDocument,
      id: Date.now().toString(),
    }

    setDocuments([...documents, document])
    setIsAddDialogOpen(false)
    setNewDocument({
      name: "",
      uploadDate: new Date().toISOString().split("T")[0],
      file: null,
    })

    toast({
      title: "Thêm thành công",
      description: "Tài liệu đã được tải lên thành công",
      duration: 3000,
    })
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    toast({
      title: "Xóa thành công",
      description: "Tài liệu đã được xóa thành công",
      duration: 3000,
    })
  }

  if (!customField) {
    return <div className="flex h-full items-center justify-center">Đang tải...</div>
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customField.name}</h1>
            <p className="text-muted-foreground">Quản lý tài liệu cho {customField.name}</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tải lên tài liệu
          </Button>
        </div>

        {documents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
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
                  <CardTitle className="line-clamp-1">{document.name}</CardTitle>
                  <CardDescription>
                    Ngày tải lên: {new Date(document.uploadDate).toLocaleDateString("vi-VN")}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="destructive" className="ml-auto" onClick={() => handleDeleteDocument(document.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Chưa có tài liệu nào</h3>
              <p className="mb-4 text-center text-muted-foreground">
                Bạn chưa tải lên tài liệu nào cho {customField.name}. Nhấn nút bên dưới để tải lên tài liệu mới.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tải lên tài liệu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog thêm mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tải lên tài liệu mới</DialogTitle>
            <DialogDescription>Nhập thông tin và tải lên tài liệu cho {customField.name}</DialogDescription>
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
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddDocument}>Tải lên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <ToastProvider>
        {currentToast && (
          <Toast variant="success" onClose={dismissToast}>
            <ToastTitle>{currentToast.title}</ToastTitle>
            {currentToast.description && <ToastDescription>{currentToast.description}</ToastDescription>}
          </Toast>
        )}
      </ToastProvider>
    </>
  )
}
