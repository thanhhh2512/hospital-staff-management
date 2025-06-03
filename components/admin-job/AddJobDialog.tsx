import { useRef, useState, useEffect } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobAssignment } from "@/types";

type NewJob = Omit<JobAssignment, "id">;

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewJob) => void;
  initialData: NewJob;
}

export function AddJobDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: AddJobDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newJob, setNewJob] = useState<NewJob>(initialData);
useEffect(() => {
  if (open) {
    setNewJob(initialData);
  }
}, [open, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewJob({
          ...newJob,
          file: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Giao việc mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin công việc cần giao cho nhân viên
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề công việc"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeName">Tên nhân viên</Label>
              <Input
                id="employeeName"
                placeholder="Nhập tên nhân viên"
                value={newJob.employeeName}
                onChange={(e) =>
                  setNewJob({ ...newJob, employeeName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Mã nhân viên</Label>
              <Input
                id="employeeId"
                placeholder="Nhập mã nhân viên"
                value={newJob.employeeId}
                onChange={(e) =>
                  setNewJob({ ...newJob, employeeId: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Phòng/Ban</Label>
              <Input
                id="department"
                placeholder="Nhập phòng/ban"
                value={newJob.department}
                onChange={(e) =>
                  setNewJob({ ...newJob, department: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignDate">Ngày giao</Label>
              <Input
                id="assignDate"
                type="date"
                value={newJob.assignDate}
                onChange={(e) =>
                  setNewJob({ ...newJob, assignDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Hạn hoàn thành</Label>
              <Input
                id="dueDate"
                type="date"
                value={newJob.dueDate}
                onChange={(e) =>
                  setNewJob({ ...newJob, dueDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={newJob.status}
                onValueChange={(value) =>
                  setNewJob({
                    ...newJob,
                    status: value as "active" | "completed" | "overdue",
                  })
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
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewJob({ ...newJob, file: null })}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Kéo và thả hoặc nhấp để tải lên tài liệu Word
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={() => onSubmit(newJob)}>Giao việc</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
