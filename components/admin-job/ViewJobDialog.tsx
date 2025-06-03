import { FileText, Download, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { JobAssignment } from "@/types"

interface ViewJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: JobAssignment | null
  onDelete: (id: string) => void
  onEdit: (job: JobAssignment) => void
  onViewFile: (job: JobAssignment) => void
}

export function ViewJobDialog({ open, onOpenChange, job, onDelete, onEdit, onViewFile }: ViewJobDialogProps) {
  if (!job) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết công việc</DialogTitle>
          <DialogDescription>Thông tin chi tiết về công việc được giao</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Tiêu đề</h3>
              <p>{job.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Tên nhân viên</h3>
              <p>{job.employeeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Mã nhân viên</h3>
              <p>{job.employeeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Phòng/Ban</h3>
              <p>{job.department}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Ngày giao</h3>
              <p>{new Date(job.assignDate).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Hạn hoàn thành</h3>
              <p>{new Date(job.dueDate).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Trạng thái</h3>
              <Badge
                variant={
                  job.status === "active"
                    ? "default"
                    : job.status === "completed"
                      ? "success"
                      : "destructive"
                }
              >
                {job.status === "active"
                  ? "Đang thực hiện"
                  : job.status === "completed"
                    ? "Hoàn thành"
                    : "Quá hạn"}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Mô tả công việc</h3>
            <div className="rounded-md border p-4">
              <p>{job.description}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Tài liệu đính kèm</h3>
            {job.file ? (
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>Tài liệu công việc.docx</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onViewFile(job)}>
                    <Download className="mr-2 h-4 w-4" />
                    Xem / Tải xuống
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button variant="secondary" onClick={() => onEdit(job)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={() => onDelete(job.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 