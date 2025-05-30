"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Download, Eye, FileText, Plus, Trash2, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider } from "@/components/ui/toast"

// Định nghĩa schema cho form tài liệu
const documentFormSchema = z.object({
  title: z.string().min(2, { message: "Tiêu đề phải có ít nhất 2 ký tự" }),
  category: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
  employeeName: z.string().min(2, { message: "Tên nhân viên phải có ít nhất 2 ký tự" }),
  employeeId: z.string().min(1, { message: "Vui lòng nhập mã nhân viên" }),
  description: z.string().optional(),
  uploadDate: z.string().min(1, { message: "Vui lòng chọn ngày tải lên" }),
  status: z.enum(["active", "archived", "pending"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
  file: z.string().optional(),
})

type DocumentFormValues = z.infer<typeof documentFormSchema>

interface Document {
  id: string
  title: string
  category: string
  employeeName: string
  employeeId: string
  description: string
  uploadDate: string
  status: "active" | "archived" | "pending"
  file: string | null
}

export default function DocumentsPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Lý lịch cá nhân - Lê Thị Mức",
      category: "personal",
      employeeName: "Lê Thị Mức",
      employeeId: "NV001",
      description: "Lý lịch cá nhân của nhân viên",
      uploadDate: "2023-05-15",
      status: "active",
      file: null,
    },
    {
      id: "2",
      title: "Bằng cử nhân - Lê Thị Mức",
      category: "degree",
      employeeName: "Lê Thị Mức",
      employeeId: "NV001",
      description: "Bằng cử nhân xét nghiệm y học",
      uploadDate: "2023-05-15",
      status: "active",
      file: null,
    },
    {
      id: "3",
      title: "Phiếu tiêm chủng - Nguyễn Văn A",
      category: "vaccination",
      employeeName: "Nguyễn Văn A",
      employeeId: "NV002",
      description: "Phiếu tiêm chủng COVID-19",
      uploadDate: "2023-06-10",
      status: "active",
      file: null,
    },
    {
      id: "4",
      title: "Chứng chỉ hành nghề - Trần Thị B",
      category: "certificate",
      employeeName: "Trần Thị B",
      employeeId: "NV003",
      description: "Chứng chỉ hành nghề điều dưỡng",
      uploadDate: "2023-07-20",
      status: "active",
      file: null,
    },
    {
      id: "5",
      title: "Hồ sơ sức khỏe - Phạm Văn C",
      category: "health",
      employeeName: "Phạm Văn C",
      employeeId: "NV004",
      description: "Hồ sơ sức khỏe định kỳ",
      uploadDate: "2023-08-05",
      status: "pending",
      file: null,
    },
  ])

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Form cho thêm tài liệu mới
  const addForm = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      category: "",
      employeeName: "",
      employeeId: "",
      description: "",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "active",
      file: "",
    },
  })

  // Form cho sửa tài liệu
  const editForm = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      category: "",
      employeeName: "",
      employeeId: "",
      description: "",
      uploadDate: "",
      status: "active",
      file: "",
    },
  })

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleEditDocument = (document: Document) => {
    editForm.reset({
      title: document.title,
      category: document.category,
      employeeName: document.employeeName,
      employeeId: document.employeeId,
      description: document.description || "",
      uploadDate: document.uploadDate,
      status: document.status,
      file: document.file || "",
    })
    setSelectedDocument(document)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDocument = () => {
    if (!documentToDelete) return

    setDocuments(documents.filter((doc) => doc.id !== documentToDelete))
    setIsDeleteDialogOpen(false)
    setDocumentToDelete(null)

    toast({
      title: "Xóa thành công",
      description: "Đã xóa tài liệu khỏi hệ thống",
    })
  }

  const onAddSubmit = (data: DocumentFormValues) => {
    const newDocument = {
      ...data,
      id: Date.now().toString(),
      file: data.file || null,
    }

    setDocuments([...documents, newDocument])
    setIsAddDialogOpen(false)
    addForm.reset()

    toast({
      title: "Thêm thành công",
      description: "Đã thêm tài liệu mới vào hệ thống",
    })
  }

  const onEditSubmit = (data: DocumentFormValues) => {
    if (!selectedDocument) return

    const updatedDocument = {
      ...data,
      id: selectedDocument.id,
      file: data.file || null,
    }

    setDocuments(documents.map((doc) => (doc.id === selectedDocument.id ? updatedDocument : doc)))
    setIsEditDialogOpen(false)
    setSelectedDocument(null)

    toast({
      title: "Cập nhật thành công",
      description: "Đã cập nhật thông tin tài liệu",
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, form: any) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.setValue("file", e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Tiêu đề</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "employeeName",
      header: "Tên nhân viên",
    },
    {
      accessorKey: "employeeId",
      header: "Mã NV",
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        const categoryMap: Record<string, string> = {
          personal: "Lý lịch cá nhân",
          degree: "Bằng cấp",
          certificate: "Chứng chỉ",
          vaccination: "Phiếu tiêm chủng",
          health: "Hồ sơ sức khỏe",
          other: "Khác",
        }
        return categoryMap[category] || category
      },
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
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : status === "archived" ? "secondary" : "outline"}>
            {status === "active" ? "Hiện hành" : status === "archived" ? "Lưu trữ" : "Chờ duyệt"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original
        return (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleViewDocument(document)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEditDocument(document)}>
              <FileText className="h-4 w-4" />
              <span className="sr-only">Sửa</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(document.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "personal", name: "Lý lịch cá nhân" },
    { id: "degree", name: "Bằng cấp" },
    { id: "certificate", name: "Chứng chỉ" },
    { id: "vaccination", name: "Phiếu tiêm chủng" },
    { id: "health", name: "Hồ sơ sức khỏe" },
    { id: "other", name: "Khác" },
  ]

  const filteredDocuments = activeTab === "all" ? documents : documents.filter((doc) => doc.category === activeTab)

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý hồ sơ nhân sự</h1>
            <p className="text-muted-foreground">Quản lý các tài liệu và hồ sơ nhân sự</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tài liệu
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <DataTable
              columns={columns}
              data={filteredDocuments}
              searchColumn="title"
              searchPlaceholder="Tìm kiếm tài liệu..."
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết tài liệu</DialogTitle>
            <DialogDescription>Thông tin chi tiết về tài liệu</DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium">Tiêu đề</h3>
                  <p>{selectedDocument.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Danh mục</h3>
                  <p>
                    {categories.find((cat) => cat.id === selectedDocument.category)?.name || selectedDocument.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tên nhân viên</h3>
                  <p>{selectedDocument.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Mã nhân viên</h3>
                  <p>{selectedDocument.employeeId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ngày tải lên</h3>
                  <p>{new Date(selectedDocument.uploadDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Trạng thái</h3>
                  <Badge
                    variant={
                      selectedDocument.status === "active"
                        ? "default"
                        : selectedDocument.status === "archived"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {selectedDocument.status === "active"
                      ? "Hiện hành"
                      : selectedDocument.status === "archived"
                        ? "Lưu trữ"
                        : "Chờ duyệt"}
                  </Badge>
                </div>
              </div>

              {selectedDocument.description && (
                <div>
                  <h3 className="text-sm font-medium">Mô tả</h3>
                  <p className="mt-1 text-sm">{selectedDocument.description}</p>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-medium">Tài liệu</h3>
                {selectedDocument.file ? (
                  <div className="rounded-md border p-4">
                    <img
                      src={selectedDocument.file || "/placeholder.svg"}
                      alt={selectedDocument.title}
                      className="max-h-[300px] rounded-md object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-md border">
                    <div className="text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Không có tài liệu đính kèm</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Đóng
                </Button>
                {selectedDocument.file && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm tài liệu */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm tài liệu mới</DialogTitle>
            <DialogDescription>Nhập thông tin tài liệu mới</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề tài liệu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên nhân viên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên nhân viên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nhân viên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã nhân viên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="uploadDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tải lên</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Hiện hành</SelectItem>
                          <SelectItem value="archived">Lưu trữ</SelectItem>
                          <SelectItem value="pending">Chờ duyệt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả tài liệu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Tài liệu</Label>
                <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-4">
                  {addForm.watch("file") ? (
                    <div className="relative w-full">
                      <img
                        src={addForm.watch("file") || "/placeholder.svg"}
                        alt="Document preview"
                        className="mx-auto max-h-[200px] rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => addForm.setValue("file", "")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Kéo và thả hoặc nhấp để tải lên</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("add-file-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn tệp
                      </Button>
                      <Input
                        id="add-file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, addForm)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog sửa tài liệu */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sửa thông tin tài liệu</DialogTitle>
            <DialogDescription>Cập nhật thông tin tài liệu</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề tài liệu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="employeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên nhân viên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên nhân viên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nhân viên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã nhân viên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="uploadDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tải lên</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Hiện hành</SelectItem>
                          <SelectItem value="archived">Lưu trữ</SelectItem>
                          <SelectItem value="pending">Chờ duyệt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả tài liệu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Tài liệu</Label>
                <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-4">
                  {editForm.watch("file") ? (
                    <div className="relative w-full">
                      <img
                        src={editForm.watch("file") || "/placeholder.svg"}
                        alt="Document preview"
                        className="mx-auto max-h-[200px] rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => editForm.setValue("file", "")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Kéo và thả hoặc nhấp để tải lên</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("edit-file-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn tệp
                      </Button>
                      <Input
                        id="edit-file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, editForm)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Cập nhật</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast notifications */}
      <ToastProvider />
    </>
  )
}
