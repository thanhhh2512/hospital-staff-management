import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Certificate } from "@/types";

interface CertificateDetailProps {
  open: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onEdit: (certificate: Certificate) => void;
}

export function CertificateDetail({
  open,
  onClose,
  certificate,
  onEdit,
}: CertificateDetailProps) {
  if (!certificate) return null;

  const handleEdit = () => {
    onEdit(certificate);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{certificate.name}</DialogTitle>
          <DialogDescription>
            {certificate.type === "degree"
              ? "Bằng cấp"
              : certificate.type === "certificate"
              ? "Chứng chỉ hành nghề"
              : "Khác"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="aspect-video w-full bg-muted">
            {certificate.file ? (
              <img
                src={certificate.file || "/placeholder.svg"}
                alt={certificate.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FileText className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Ngày cấp:</span>
              <span className="col-span-2">
                {formatDate(certificate.issueDate)}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Đơn vị cấp:</span>
              <span className="col-span-2">{certificate.issuer}</span>
            </div>
            {certificate.description && (
              <div className="grid grid-cols-3 items-start gap-4">
                <span className="font-medium">Mô tả:</span>
                <p className="col-span-2">{certificate.description}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button onClick={handleEdit}>Chỉnh sửa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
