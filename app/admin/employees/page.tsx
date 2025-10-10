"use client";

import { useState } from "react";
import { Download, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import { AddEmployeeDialog } from "@/components/admin/admin-employees/AddEmployeeDialog";
import { EditEmployeeDialog } from "@/components/admin/admin-employees/EditEmployeeDialog";
import { ViewEmployeeDialog } from "@/components/admin/admin-employees/ViewEmployeeDialog";
import { DeleteEmployeeDialog } from "@/components/admin/admin-employees/DeleteEmployeeDialog";
import { EmployeeFilters } from "@/components/admin/admin-employees/EmployeeFilters";
import { employeeColumns } from "@/components/admin/admin-employees/EmployeeColumns";
import { mockEmployees } from "@/schemas/mock-data";
import type { Employee } from "@/types";

export default function EmployeesPage() {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // Lấy danh sách các chức vụ và phòng ban duy nhất
  const positions = Array.from(new Set(employees.map((emp) => emp.position)));
  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  );

  // Lọc nhân viên theo chức vụ và phòng ban
  const filteredEmployees = employees.filter((employee) => {
    const matchesPosition =
      !filterPosition || employee.position === filterPosition;
    const matchesDepartment =
      filterDepartment === "all" || employee.department === filterDepartment;
    return matchesPosition && matchesDepartment;
  });

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    try {
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);

      toast({
        title: "Xóa nhân viên thành công",
        description: "Đã xóa nhân viên khỏi danh sách.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Đã có lỗi xảy ra khi xóa nhân viên. Vui lòng thử lại sau.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onAddSubmit = async (data: Omit<Employee, "id">) => {
    setIsSubmitting(true);
    try {
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newEmployee: Employee = {
        id: (employees.length + 1).toString(),
        ...data,
      };

      setEmployees([...employees, newEmployee]);
      setIsAddDialogOpen(false);

      toast({
        title: "Thêm nhân viên thành công",
        description: `Đã thêm ${data.name} vào danh sách nhân viên.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Đã có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data: Employee) => {
    if (!selectedEmployee) return;

    setIsSubmitting(true);
    try {
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedEmployees = employees.map((emp) =>
        emp.id === selectedEmployee.id ? { ...emp, ...data } : emp
      );

      setEmployees(updatedEmployees);
      setIsEditDialogOpen(false);

      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật thông tin của ${data.name}.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Đã có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quản lý nhân viên
            </h1>
            <p className="text-muted-foreground">
              Xem và quản lý thông tin nhân viên
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
            <Button
              variant="outline"
              onClick={() => {}}
              disabled={isDownloading}
            >
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

        <EmployeeFilters
          positions={positions}
          departments={departments}
          filterPosition={filterPosition}
          filterDepartment={filterDepartment}
          onPositionChange={setFilterPosition}
          onDepartmentChange={setFilterDepartment}
        />

        <DataTable
          columns={employeeColumns({
            onView: handleViewEmployee,
            onEdit: handleEditEmployee,
            onDelete: handleDeleteClick,
          })}
          data={filteredEmployees}
          searchColumn="name"
          searchPlaceholder="Tìm kiếm nhân viên..."
        />
      </div>

      <ToastProvider>
        <AddEmployeeDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={onAddSubmit}
        />

        <EditEmployeeDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={onEditSubmit}
          employee={selectedEmployee}
        />

        <ViewEmployeeDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          employee={selectedEmployee}
        />

        <DeleteEmployeeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteEmployee}
          isDeleting={isDeleting}
        />
      </ToastProvider>
    </>
  );
}
