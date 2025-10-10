import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, ArrowUpDown, Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { JobAssignment } from "@/types";

interface JobColumnsProps {
  onView: (job: JobAssignment) => void;
  onEdit: (job: JobAssignment) => void;
  onDelete: (id: string) => void;
}

export const jobColumns = ({
  onView,
  onEdit,
  onDelete,
}: JobColumnsProps): ColumnDef<JobAssignment>[] => [
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
      const date = new Date(row.getValue("assignDate"));
      return date.toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "dueDate",
    header: "Hạn hoàn thành",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
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
              : status === "completed"
              ? "success"
              : "destructive"
          }
        >
          {status === "active"
            ? "Đang thực hiện"
            : status === "completed"
            ? "Hoàn thành"
            : "Quá hạn"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onView(job)}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Xem chi tiết</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(job)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Chỉnh sửa</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(job.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        </div>
      );
    },
  },
];
