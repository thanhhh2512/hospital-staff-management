import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DocumentView } from "@/types";

interface Category {
  id: string;
  name: string;
}

interface ViewDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentView | null;
  categories: Category[];
}

export function ViewDocumentDialog({
  open,
  onOpenChange,
  document,
  categories,
}: ViewDocumentDialogProps) {
  if (!document) return null;

  const categoryName =
    categories.find((cat) => cat.id === document.category)?.name ||
    document.category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài liệu</DialogTitle>
          <DialogDescription>Thông tin chi tiết về tài liệu</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium">Tiêu đề</h3>
              <p>{document.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Danh mục</h3>
              <p>{categoryName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Tên nhân viên</h3>
              <p>{document.employeeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Mã nhân viên</h3>
              <p>{document.employeeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Ngày tải lên</h3>
              <p>{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Trạng thái</h3>
              <Badge
                variant={
                  document.status === "active"
                    ? "default"
                    : document.status === "archived"
                    ? "secondary"
                    : "outline"
                }
              >
                {document.status === "active"
                  ? "Hiện hành"
                  : document.status === "archived"
                  ? "Lưu trữ"
                  : "Chờ duyệt"}
              </Badge>
            </div>
          </div>

          {document.description && (
            <div>
              <h3 className="text-sm font-medium">Mô tả</h3>
              <p className="mt-1 text-sm">{document.description}</p>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-medium">Tài liệu</h3>
            {document.file ? (
              <div className="rounded-md border p-4">
                <img
                  src={document.file || "/placeholder.svg"}
                  alt={document.title}
                  className="max-h-[300px] rounded-md object-contain"
                />
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Không có tài liệu đính kèm
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = `/admin/${document.sourceType}s/${document.sourceId}`;
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Đi tới nguồn
            </Button>
            {document.file && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
