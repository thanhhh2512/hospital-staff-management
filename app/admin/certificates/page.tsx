"use client"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

interface Certificate {
  id: string
  employeeName: string
  employeeId: string
  name: string
  type: string
  issueDate: string
  issuer: string
  status: "active" | "expired" | "pending"
  file: string | null
}

export default function CertificatesPage() {
  const { toast, currentToast, dismissToast } = useToast()
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      employeeName: "Lê Thị Mức",
      employeeId: "NV001",
      name: "Bằng Cử nhân Xét nghiệm Y học",
      type: "degree",
      issueDate: "2012-10-15",
      issuer: "Trường Đại học Y Dược TP. Hồ Chí Minh",
      status: "active",
      file: null,
    },
    {
      id: "2",
      employeeName: "Nguyễn Văn A",
      employeeId: "NV002",
      name: "Chứng chỉ hành nghề Bác sĩ đa khoa",
      type: "certificate",
      issueDate: "2018-05-20",
      issuer: "Bộ Y tế",
      status: "active",
      file: null,
    },
    {
      id: "3",
      employeeName: "Trần Thị B",
      employeeId: "NV003",
      name: "Chứng chỉ Điều dưỡng",
      type: "certificate",
      issueDate: "2019-03-10",
      issuer: "Bộ Y tế",
      status: "active",
      file: null,
    },
    {
      id: "4",
      employeeName: "Phạm Văn C",
      employeeId: "NV004",
      name: "Bằng Bác sĩ Chuyên khoa I",
      type: "degree",
      issueDate: "2020-11-05",
      issuer: "Đại học Y Hà Nội",
      status: "active",
      file: null,
    },
    {
      id: "5",
      employeeName: "Hoàng Thị D",
      employeeId: "NV005",
      name: "Chứng chỉ hành nghề Dược sĩ",
      type: "certificate",
      issueDate: "2017-08-12",
      issuer: "Bộ Y tế",
      status: "expired",
      file: null,
    },
  ])

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, "id">>({
    employeeName: "",
    employeeId: "",
    name: "",
    type: "degree",
    issueDate: "",
    issuer: "",
    status: "active",
    file: null,
  })

  const handleAddCertificate = () => {
    const certificate = {
      ...newCertificate,
      id: Date.now().toString(),
    }

    setCertificates([...certificates, certificate])
    setIsAddDialogOpen(false)
    setNewCertificate({
      employeeName: "",
      employeeId: "",
      name: "",
      type: "degree",
      issueDate: "",
      issuer: "",
      status: "active",
      file: null,
    })

    toast({
      title: "Thêm thành công",
      description: "Bằng cấp/chứng chỉ đã được thêm vào hệ thống",
      duration: 3000,
    })
  }

  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id))
    toast({
      title: "Xóa thành công",
      description: "Bằng cấp/chứng chỉ đã được xóa khỏi hệ thống",
      duration: 3000,
    })
  }

  const columns: ColumnDef<Certificate>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Tên bằng cấp/chứng chỉ</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return type === "degree" ? "Bằng cấp" : "Chứng chỉ"
      },
    },
    {
      accessorKey: "issueDate",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Ngày cấp</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("issueDate"))
        return date.toLocaleDateString("vi-VN")
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : status === "expired" ? "destructive" : "secondary"}>
            {status === "active" ? "Hiện hành" : status === "expired" ? "Hết hạn" : "Chờ duyệt"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const certificate = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedCertificate(certificate)
                setIsViewDialogOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteCertificate(certificate.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý bằng cấp & chứng chỉ</h1>
            <p className="text-muted-foreground">Quản lý bằng cấp và chứng chỉ hành nghề của nhân viên</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bằng cấp/chứng chỉ
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="active">Hiện hành</TabsTrigger>
            <TabsTrigger value="expired">Hết hạn</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <DataTable
              columns={columns}
              data={certificates}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <DataTable
              columns={columns}
              data={certificates.filter((cert) => cert.status === "active")}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
          <TabsContent value="expired" className="mt-4">
            <DataTable
              columns={columns}
              data={certificates.filter((cert) => cert.status === "expired")}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <DataTable
              columns={columns}
              data={certificates.filter((cert) => cert.status === "pending")}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết bằng cấp/chứng chỉ</DialogTitle>
            <DialogDescription>Thông tin chi tiết về bằng cấp/chứng chỉ của nhân viên</DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Tên nhân viên</h3>
                  <p>{selectedCertificate.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Mã nhân viên</h3>
                  <p>{selectedCertificate.employeeId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tên bằng cấp/chứng chỉ</h3>
                  <p>{selectedCertificate.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Loại</h3>
                  <p>{selectedCertificate.type === "degree" ? "Bằng cấp" : "Chứng chỉ"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ngày cấp</h3>
                  <p>{new Date(selectedCertificate.issueDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Đơn vị cấp</h3>
                  <p>{selectedCertificate.issuer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Trạng thái</h3>
                  <Badge
                    variant={
                      selectedCertificate.status === "active"
                        ? "default"
                        : selectedCertificate.status === "expired"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {selectedCertificate.status === "active"
                      ? "Hiện hành"
                      : selectedCertificate.status === "expired"
                        ? "Hết hạn"
                        : "Chờ duyệt"}
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 text-sm font-medium">Hình ảnh bằng cấp/chứng chỉ</h3>
                {selectedCertificate.file ? (
                  <img
                    src={selectedCertificate.file || "/placeholder.svg"}
                    alt={selectedCertificate.name}
                    className="max-h-[300px] rounded-md object-contain"
                  />
                ) : (
                  <div className="flex h-[200px] items-center justify-center rounded-md bg-muted">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Chưa có hình ảnh</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteCertificate(selectedCertificate.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm mới */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm bằng cấp/chứng chỉ mới</DialogTitle>
            <DialogDescription>Nhập thông tin bằng cấp/chứng chỉ của nhân viên</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Tên nhân viên</Label>
                <Input
                  id="employeeName"
                  placeholder="Nhập tên nhân viên"
                  value={newCertificate.employeeName}
                  onChange={(e) => setNewCertificate({ ...newCertificate, employeeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Mã nhân viên</Label>
                <Input
                  id="employeeId"
                  placeholder="Nhập mã nhân viên"
                  value={newCertificate.employeeId}
                  onChange={(e) => setNewCertificate({ ...newCertificate, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên bằng cấp/chứng chỉ</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên bằng cấp/chứng chỉ"
                  value={newCertificate.name}
                  onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại</Label>
                <Select
                  value={newCertificate.type}
                  onValueChange={(value) =>
                    setNewCertificate({ ...newCertificate, type: value as "degree" | "certificate" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="degree">Bằng cấp</SelectItem>
                    <SelectItem value="certificate">Chứng chỉ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Ngày cấp</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={newCertificate.issueDate}
                  onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer">Đơn vị cấp</Label>
                <Input
                  id="issuer"
                  placeholder="Nhập đơn vị cấp"
                  value={newCertificate.issuer}
                  onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={newCertificate.status}
                  onValueChange={(value) =>
                    setNewCertificate({ ...newCertificate, status: value as "active" | "expired" | "pending" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hiện hành</SelectItem>
                    <SelectItem value="expired">Hết hạn</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hình ảnh bằng cấp/chứng chỉ</Label>
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
            <Button onClick={handleAddCertificate}>Thêm</Button>
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
