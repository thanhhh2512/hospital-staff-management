import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "@/types";

interface EmployeeColumnsProps {
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const employeeColumns = ({
  onView,
  onEdit,
  onDelete,
}: EmployeeColumnsProps): ColumnDef<Employee>[] => [
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
      const date = new Date(row.getValue("hireDate"));
      return date.toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "inactive"
              ? "destructive"
              : "secondary"
          }
        >
          {status === "active"
            ? "Đang làm việc"
            : status === "inactive"
            ? "Nghỉ việc"
            : "Nghỉ phép"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onView(employee)}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Sửa</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(employee.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        </div>
      );
    },
  },
];
