import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Eye, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Certificate } from "@/types"

interface CertificateColumnsProps {
  onView: (certificate: Certificate) => void
  onDelete: (id: string) => void
}

export function getCertificateColumns({
  onView,
  onDelete,
}: CertificateColumnsProps): ColumnDef<Certificate>[] {
  return [
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
              onClick={() => onView(certificate)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Xem chi tiết</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(certificate.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>
        )
      },
    },
  ]
} 