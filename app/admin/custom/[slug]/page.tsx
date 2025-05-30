"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, FileText, Plus, Trash2, Upload } from "lucide-react"
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
  employeeName: string
  employeeId: string
  uploadDate: string
  file: string | null
}

export default function CustomFieldPage() {
  const params = useParams()
  const router = useRouter()
  const { toast, currentToast, dismissToast } = useToast()
  const [customField, setCustomField] = useState<CustomField | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDocument, setNewDocument] = useState<Omit<Document, "id">>({
    employeeName: "",
    employeeId: "",
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
        // Nếu không tìm thấy trường, chuyển hướng về trang quản trị
        router.push("/admin/dashboard")
      }
    }
  }, [params.slug, router])

  const handleAddDocument = () => {
    const document = {
      ...newDocument,
      id: Date.now().toString(),
    }

    setDocuments([...documents, document])
    setIsAddDialogOpen(false)
    setNewDocument({
      employeeName: "",
      employeeId: "",
      uploadDate: new Date().toISOString().split("T")[0],
      file: null,
    })

    toast({
      title: "Thêm thành công",
      description: "Tài liệu đã được thêm vào hệ thống",
      duration: 3000,
    })
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    toast({
      title: "Xóa thành công",
      description: "Tài liệu đã được xóa khỏi hệ thống",
      duration: 3000,
    })
  }

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "employeeName",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Tên nhân viên</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "employeeId",
      header: "Mã NV",
    },
    {
      accessorKey: "uploadDate",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Ngày tải lên</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("uploadDate"))
        return date.toLocaleDateString("vi-VN")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>
        )
      },
    },
  ]

  if (!customField) {
    return <div className="flex h-full items-center justify-center">Đang tải...</div>
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customField.name}</h1>
            <p className="text-muted-foreground">Quản lý tài liệu cho trường tùy chỉnh</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tài liệu
          </Button>
        </div>

        {documents.length > 0 ? (
          <DataTable
            columns={columns}
            data={documents}
            searchColumn="employeeName"
            searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Chưa có tài liệu nào</h3>
              <p className="mb-4 text-center text-muted-foreground">
                Chưa có tài liệu nào được thêm vào trường này. Nhấn nút bên dưới để thêm tài liệu mới.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm tài liệu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog thêm mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm tài liệu mới</DialogTitle>
            <DialogDescription>Nhập thông tin và tải lên tài liệu cho trường {customField.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Tên nhân viên</Label>
                <Input
                  id="employeeName"
                  placeholder="Nhập tên nhân viên"
                  value={newDocument.employeeName}
                  onChange={(e) => setNewDocument({ ...newDocument, employeeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Mã nhân viên</Label>
                <Input
                  id="employeeId"
                  placeholder="Nhập mã nhân viên"
                  value={newDocument.employeeId}
                  onChange={(e) => setNewDocument({ ...newDocument, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uploadDate">Ngày tải lên</Label>
                <Input
                  id="uploadDate"
                  type="date"
                  value={newDocument.uploadDate}
                  onChange={(e) => setNewDocument({ ...newDocument, uploadDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tài liệu</Label>
              <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Kéo và thả hoặc nhấp để tải lên</p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Chọn tệp
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddDocument}>Thêm</Button>
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
