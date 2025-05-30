"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

interface JobAssignment {
  id: string
  title: string
  employeeName: string
  employeeId: string
  department: string
  assignDate: string
  dueDate: string
  status: "active" | "completed" | "overdue"
  description: string
  file: string | null
}

export default function JobAssignmentsPage() {
  const { toast, currentToast, dismissToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jobAssignments, setJobAssignments] = useState<JobAssignment[]>([
    {
      id: "1",
      title: "Mô tả công việc Kỹ thuật viên xét nghiệm",
      employeeName: "Lê Thị Mức",
      employeeId: "NV001",
      department: "Chuyên khoa xét nghiệm",
      assignDate: "2023-01-15",
      dueDate: "2023-12-31",
      status: "active",
      description: "Mô tả chi tiết về công việc và trách nhiệm của kỹ thuật viên xét nghiệm.",
      file: null,
    },
    {
      id: "2",
      title: "Quy trình xét nghiệm mẫu máu",
      employeeName: "Lê Thị Mức",
      employeeId: "NV001",
      department: "Chuyên khoa xét nghiệm",
      assignDate: "2023-03-22",
      dueDate: "2023-12-31",
      status: "active",
      description: "Quy trình chi tiết về cách thực hiện xét nghiệm mẫu máu theo tiêu chuẩn mới.",
      file: null,
    },
    {
      id: "3",
      title: "Mô tả công việc Bác sĩ nội khoa",
      employeeName: "Nguyễn Văn A",
      employeeId: "NV002",
      department: "Khoa Nội",
      assignDate: "2023-02-10",
      dueDate: "2023-12-31",
      status: "active",
      description: "Mô tả chi tiết về công việc và trách nhiệm của bác sĩ nội khoa.",
      file: null,
    },
    {
      id: "4",
      title: "Quy trình khám bệnh ngoại trú",
      employeeName: "Trần Thị B",
      employeeId: "NV003",
      department: "Khoa Ngoại",
      assignDate: "2023-04-05",
      dueDate: "2023-05-05",
      status: "completed",
      description: "Quy trình chi tiết về cách thực hiện khám bệnh ngoại trú theo tiêu chuẩn mới.",
      file: null,
    },
    {
      id: "5",
      title: "Quy trình cấp cứu",
      employeeName: "Phạm Văn C",
      employeeId: "NV004",
      department: "Khoa Cấp cứu",
      assignDate: "2023-03-15",
      dueDate: "2023-04-15",
      status: "overdue",
      description: "Quy trình chi tiết về cách thực hiện cấp cứu theo tiêu chuẩn mới.",
      file: null,
    },
  ])

  const [selectedJob, setSelectedJob] = useState<JobAssignment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newJob, setNewJob] = useState<Omit<JobAssignment, "id">>({
    title: "",
    employeeName: "",
    employeeId: "",
    department: "",
    assignDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "active",
    description: "",
    file: null,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewJob({
          ...newJob,
          file: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddJob = () => {
    const job = {
      ...newJob,
      id: Date.now().toString(),
    }

    setJobAssignments([...jobAssignments, job])
    setIsAddDialogOpen(false)
    setNewJob({
      title: "",
      employeeName: "",
      employeeId: "",
      department: "",
      assignDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      status: "active",
      description: "",
      file: null,
    })

    toast({
      title: "Thêm thành công",
      description: "Công việc đã được giao cho nhân viên",
      duration: 3000,
    })
  }

  const handleDeleteJob = (id: string) => {
    setJobAssignments(jobAssignments.filter((job) => job.id !== id))
    toast({
      title: "Xóa thành công",
      description: "Công việc đã được xóa khỏi hệ thống",
      duration: 3000,
    })
  }

  const columns: ColumnDef<JobAssignment>[] = [
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
      accessorKey: "department",
      header: "Phòng/Ban",
    },
    {
      accessorKey: "assignDate",
      header: "Ngày giao",
      cell: ({ row }) => {
        const date = new Date(row.getValue("assignDate"))
        return date.toLocaleDateString("vi-VN")
      },
    },
    {
      accessorKey: "dueDate",
      header: "Hạn hoàn thành",
      cell: ({ row }) => {
        const date = new Date(row.getValue("dueDate"))
        return date.toLocaleDateString("vi-VN")
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : status === "completed" ? "success" : "destructive"}>
            {status === "active" ? "Đang thực hiện" : status === "completed" ? "Hoàn thành" : "Quá hạn"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedJob(job)
                setIsViewDialogOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)}>
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
            <h1 className="text-3xl font-bold tracking-tight">Giao việc</h1>
            <p className="text-muted-foreground">Quản lý và giao việc cho nhân viên</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Giao việc mới
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="active">Đang thực hiện</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <DataTable
              columns={columns}
              data={jobAssignments}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <DataTable
              columns={columns}
              data={jobAssignments.filter((job) => job.status === "active")}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <DataTable
              columns={columns}
              data={jobAssignments.filter((job) => job.status === "completed")}
              searchColumn="employeeName"
              searchPlaceholder="Tìm kiếm theo tên nhân viên..."
            />
          </TabsContent>
          <TabsContent value="overdue" className="mt-4">
            <DataTable
              columns={columns}
              data={jobAssignments.filter((job) => job.status === "overdue")}
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
            <DialogTitle>Chi tiết công việc</DialogTitle>
            <DialogDescription>Thông tin chi tiết về công việc được giao</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Tiêu đề</h3>
                  <p>{selectedJob.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tên nhân viên</h3>
                  <p>{selectedJob.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Mã nhân viên</h3>
                  <p>{selectedJob.employeeId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Phòng/Ban</h3>
                  <p>{selectedJob.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ngày giao</h3>
                  <p>{new Date(selectedJob.assignDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Hạn hoàn thành</h3>
                  <p>{new Date(selectedJob.dueDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Trạng thái</h3>
                  <Badge
                    variant={
                      selectedJob.status === "active"
                        ? "default"
                        : selectedJob.status === "completed"
                          ? "success"
                          : "destructive"
                    }
                  >
                    {selectedJob.status === "active"
                      ? "Đang thực hiện"
                      : selectedJob.status === "completed"
                        ? "Hoàn thành"
                        : "Quá hạn"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Mô tả công việc</h3>
                <div className="rounded-md border p-4">
                  <p>{selectedJob.description}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Tài liệu đính kèm</h3>
                {selectedJob.file ? (
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Tài liệu công việc.docx</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[100px] items-center justify-center rounded-md border">
                    <p className="text-muted-foreground">Không có tài liệu đính kèm</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Đóng
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteJob(selectedJob.id)}>
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
            <DialogTitle>Giao việc mới</DialogTitle>
            <DialogDescription>Nhập thông tin công việc cần giao cho nhân viên</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề công việc"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeName">Tên nhân viên</Label>
                <Input
                  id="employeeName"
                  placeholder="Nhập tên nhân viên"
                  value={newJob.employeeName}
                  onChange={(e) => setNewJob({ ...newJob, employeeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Mã nhân viên</Label>
                <Input
                  id="employeeId"
                  placeholder="Nhập mã nhân viên"
                  value={newJob.employeeId}
                  onChange={(e) => setNewJob({ ...newJob, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Phòng/Ban</Label>
                <Input
                  id="department"
                  placeholder="Nhập phòng/ban"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignDate">Ngày giao</Label>
                <Input
                  id="assignDate"
                  type="date"
                  value={newJob.assignDate}
                  onChange={(e) => setNewJob({ ...newJob, assignDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Hạn hoàn thành</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newJob.dueDate}
                  onChange={(e) => setNewJob({ ...newJob, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={newJob.status}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, status: value as "active" | "completed" | "overdue" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="overdue">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả công việc</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chi tiết về công việc"
                rows={5}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tài liệu đính kèm</Label>
              <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-4">
                {newJob.file ? (
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Tài liệu đã tải lên</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setNewJob({ ...newJob, file: null })}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Kéo và thả hoặc nhấp để tải lên tài liệu Word</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Chọn tệp
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            <Button onClick={handleAddJob}>Giao việc</Button>
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
