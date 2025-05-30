"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Download, Eye, FileText, ArrowUpDown, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider } from "@/components/ui/toast"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"

// Định nghĩa schema cho form nhân viên
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  position: z.string().min(2, { message: "Chức vụ phải có ít nhất 2 ký tự" }),
  department: z.string().min(2, { message: "Phòng/ban phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
  hireDate: z.string().min(1, { message: "Vui lòng chọn ngày tuyển dụng" }),
  status: z.enum(["active", "inactive", "onleave"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  hireDate: string
  status: "active" | "inactive" | "onleave"
}

export default function EmployeesPage() {
  const { toast } = useToast()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
  const [filterPosition, setFilterPosition] = useState<string>("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Sample employee data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Lê Thị Mức",
      position: "Kỹ thuật viên xét nghiệm",
      department: "Chuyên khoa xét nghiệm",
      email: "muchau99@gmail.com",
      phone: "0919.474.649",
      hireDate: "2006-08-10",
      status: "active",
    },
    {
      id: "2",
      name: "Nguyễn Văn A",
      position: "Bác sĩ",
      department: "Khoa Nội",
      email: "nguyenvana@hospital.com",
      phone: "0912.345.678",
      hireDate: "2010-03-15",
      status: "active",
    },
    {
      id: "3",
      name: "Trần Thị B",
      position: "Điều dưỡng",
      department: "Khoa Ngoại",
      email: "tranthib@hospital.com",
      phone: "0987.654.321",
      hireDate: "2015-05-22",
      status: "onleave",
    },
    {
      id: "4",
      name: "Phạm Văn C",
      position: "Bác sĩ",
      department: "Khoa Cấp cứu",
      email: "phamvanc@hospital.com",
      phone: "0923.456.789",
      hireDate: "2018-11-08",
      status: "active",
    },
    {
      id: "5",
      name: "Hoàng Thị D",
      position: "Dược sĩ",
      department: "Khoa Dược",
      email: "hoangthid@hospital.com",
      phone: "0934.567.890",
      hireDate: "2019-02-14",
      status: "inactive",
    },
  ])

  // Form cho thêm nhân viên mới
  const addForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      hireDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
  })

  // Form cho sửa nhân viên
  const editForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      hireDate: "",
      status: "active",
    },
  })

  // Lấy danh sách các chức vụ và phòng ban duy nhất
  const positions = Array.from(new Set(employees.map((emp) => emp.position)))
  const departments = Array.from(new Set(employees.map((emp) => emp.department)))

  // Lọc nhân viên theo chức vụ và phòng ban
  const filteredEmployees = employees.filter((employee) => {
    const matchesPosition = !filterPosition || employee.position === filterPosition
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment
    return matchesPosition && matchesDepartment
  })

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    editForm.reset({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      hireDate: employee.hireDate,
      status: employee.status,
    })
    setSelectedEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return
    
    setIsDeleting(true)
    try {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete))
      setIsDeleteDialogOpen(false)
      setEmployeeToDelete(null)
      
      toast({
        title: "Xóa nhân viên thành công",
        description: "Đã xóa nhân viên khỏi danh sách.",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi xóa nhân viên. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const onAddSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newEmployee: Employee = {
        id: (employees.length + 1).toString(),
        ...data,
      }
      
      setEmployees([...employees, newEmployee])
      setIsAddDialogOpen(false)
      addForm.reset()
      
      toast({
        title: "Thêm nhân viên thành công",
        description: `Đã thêm ${data.name} vào danh sách nhân viên.`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onEditSubmit = async (data: EmployeeFormValues) => {
    if (!selectedEmployee) return
    
    setIsSubmitting(true)
    try {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedEmployees = employees.map((emp) =>
        emp.id === selectedEmployee.id ? { ...emp, ...data } : emp
      )
      
      setEmployees(updatedEmployees)
      setIsEditDialogOpen(false)
      
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật thông tin của ${data.name}.`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      if (!selectedEmployee) return

      const profileElement = document.getElementById("employee-profile")
      if (!profileElement) return

      // Create a clone of the profile element to avoid modifying the original
      const profileClone = profileElement.cloneNode(true) as HTMLElement

      // Create a container for the clone with basic styling
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      container.style.width = profileElement.offsetWidth + "px"

      // Apply simple color scheme to avoid oklch color format issues
      container.style.color = "black"
      container.style.backgroundColor = "white"

      // Append the clone to the container
      container.appendChild(profileClone)
      document.body.appendChild(container)

      // Force all text to black and backgrounds to appropriate colors
      const allElements = container.querySelectorAll("*")
      allElements.forEach((el) => {
        const element = el as HTMLElement
        element.style.color = "black"

        // Set background colors explicitly to avoid oklch
        if (window.getComputedStyle(element).backgroundColor !== "rgba(0, 0, 0, 0)") {
          element.style.backgroundColor = "white"
        }

        // Handle borders
        if (window.getComputedStyle(element).borderColor) {
          element.style.borderColor = "#e5e7eb" // A light gray color
        }
      })

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "white",
      })

      // Remove the temporary container
      document.body.removeChild(container)

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`ly-lich-${selectedEmployee.name.replace(/\s+/g, "-").toLowerCase()}.pdf`)

      toast({
        title: "Tải xuống thành công",
        description: "Danh sách nhân viên đã được tải xuống dạng PDF.",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi tải xuống PDF. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Họ và tên</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: "Chức vụ",
    },
    {
      accessorKey: "department",
      header: "Phòng/Ban",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
    },
    {
      accessorKey: "hireDate",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>Ngày tuyển dụng</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("hireDate"))
        return date.toLocaleDateString("vi-VN")
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : status === "inactive" ? "destructive" : "secondary"}>
            {status === "active" ? "Đang làm việc" : status === "inactive" ? "Nghỉ việc" : "Nghỉ phép"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original
        return (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleViewEmployee(employee)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Sửa</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(employee.id)}>
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
            <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h1>
            <p className="text-muted-foreground">Xem và quản lý thông tin nhân viên</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải xuống...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/3">
            <Label htmlFor="position-filter">Lọc theo chức vụ</Label>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger id="position-filter">
                <SelectValue placeholder="Tất cả chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_positions">Tất cả chức vụ</SelectItem>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <Label htmlFor="department-filter">Lọc theo phòng ban</Label>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="Tất cả phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredEmployees}
          searchColumn="name"
          searchPlaceholder="Tìm kiếm nhân viên..."
        />
      </div>

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thông tin nhân viên</DialogTitle>
            <DialogDescription>Chi tiết thông tin cá nhân và nghề nghiệp</DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải PDF
                </Button>
              </div>

              <div id="employee-profile" className="space-y-8 rounded-md border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                    <p className="text-muted-foreground">{selectedEmployee.position}</p>
                  </div>
                  <div className="h-32 w-24 overflow-hidden rounded border">
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      Ảnh 3x4
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Thông tin cá nhân</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Số điện thoại:</span>
                        <span>{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ngày sinh:</span>
                        <span>11/03/1983</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Giới tính:</span>
                        <span>Nữ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Địa chỉ:</span>
                        <span>Số 204 Trần Việt Châu, P. An Hòa, Q. Ninh Kiều, TP. Cần Thơ</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Thông tin công việc</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Phòng/Ban:</span>
                        <span>{selectedEmployee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ngày tuyển dụng:</span>
                        <span>{new Date(selectedEmployee.hireDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Trình độ:</span>
                        <span>Cử nhân</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Chuyên ngành:</span>
                        <span>Xét nghiệm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Bậc lương:</span>
                        <span>5/9, Hệ số: 3.66</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Bằng cấp & Chứng chỉ</h3>
                  <div className="rounded-md border">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Tên</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Loại</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Ngày cấp</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Đơn vị cấp</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">Bằng Cử nhân Xét nghiệm Y học</td>
                          <td className="p-4 align-middle">Bằng cấp</td>
                          <td className="p-4 align-middle">15/10/2012</td>
                          <td className="p-4 align-middle">Trường Đại học Y Dược TP. Hồ Chí Minh</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">Danh mục hồ sơ nhân sự</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-md border p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Lý lịch cá nhân</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Bằng cấp</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Chứng chỉ hành nghề</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border p-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Phiếu tiêm chủng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm nhân viên */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
            <DialogDescription>Nhập thông tin nhân viên mới</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức vụ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập chức vụ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng/Ban</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập phòng/ban" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tuyển dụng</FormLabel>
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
                          <SelectItem value="active">Đang làm việc</SelectItem>
                          <SelectItem value="inactive">Nghỉ việc</SelectItem>
                          <SelectItem value="onleave">Nghỉ phép</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog sửa nhân viên */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin nhân viên</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức vụ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập chức vụ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng/Ban</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập phòng/ban" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tuyển dụng</FormLabel>
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
                          <SelectItem value="active">Đang làm việc</SelectItem>
                          <SelectItem value="inactive">Nghỉ việc</SelectItem>
                          <SelectItem value="onleave">Nghỉ phép</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Nhân viên này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteEmployee()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast notifications */}
      <ToastProvider />
    </>
  )
}
