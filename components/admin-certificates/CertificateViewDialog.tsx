import { Download, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Certificate } from "@/types";

interface CertificateViewDialogProps {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export function CertificateViewDialog({
  certificate,
  open,
  onOpenChange,
  onDelete,
}: CertificateViewDialogProps) {
  if (!certificate) return null;

  const handleDownload = () => {
    if (!certificate.file) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = certificate.file;
    link.download = `${certificate.name}-${
      certificate.employeeName || "certificate"
    }${certificate.file.endsWith(".pdf") ? ".pdf" : ".jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPDF = certificate.file?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bằng cấp/chứng chỉ</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về bằng cấp/chứng chỉ của nhân viên
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Tên nhân viên</h3>
              <p>{certificate.employeeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Mã nhân viên</h3>
              <p>{certificate.employeeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Tên bằng cấp/chứng chỉ</h3>
              <p>{certificate.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Loại</h3>
              <p>{certificate.type === "degree" ? "Bằng cấp" : "Chứng chỉ"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Ngày cấp</h3>
              <p>
                {new Date(certificate.issueDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Đơn vị cấp</h3>
              <p>{certificate.issuer}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Trạng thái</h3>
              <Badge
                variant={
                  certificate.status === "active"
                    ? "default"
                    : certificate.status === "expired"
                    ? "destructive"
                    : "secondary"
                }
              >
                {certificate.status === "active"
                  ? "Hiện hành"
                  : certificate.status === "expired"
                  ? "Hết hạn"
                  : "Chờ duyệt"}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-medium">
              Hình ảnh bằng cấp/chứng chỉ
            </h3>
            {certificate.file ? (
              <div className="space-y-2">
                {isPDF ? (
                  <div className="flex items-center justify-center h-[200px] bg-muted rounded-md">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Tài liệu PDF</p>
                  </div>
                ) : (
                  <img
                    src={certificate.file}
                    alt={certificate.name}
                    className="max-h-[300px] w-full rounded-md object-contain"
                  />
                )}
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống {isPDF ? "PDF" : "hình ảnh"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md bg-muted">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground">Chưa có hình ảnh</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => onDelete(certificate.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
