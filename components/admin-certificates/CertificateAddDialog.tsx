import { useState, useRef } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
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
import type { Certificate } from "@/types";
import { uploadFile, FileValidationError } from "@/services/file-upload";

interface CertificateAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (certificate: Omit<Certificate, "id">) => void;
}

export function CertificateAddDialog({
  open,
  onOpenChange,
  onSubmit,
}: CertificateAddDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, "id">>(
    {
      employeeName: "",
      employeeId: "",
      name: "",
      type: "degree",
      issueDate: "",
      issuer: "",
      description: "",
      status: "active",
      file: null,
    }
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadFile(file);
      setNewCertificate({
        ...newCertificate,
        file: result.url,
      });
      toast({
        title: "Tải lên thành công",
        description: "Tệp đã được tải lên thành công",
      });
    } catch (error) {
      if (error instanceof FileValidationError) {
        toast({
          variant: "destructive",
          title: "Lỗi tải lên",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi tải lên",
          description: "Đã xảy ra lỗi khi tải lên tệp",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setNewCertificate({
      ...newCertificate,
      file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    onSubmit(newCertificate);
    setNewCertificate({
      employeeName: "",
      employeeId: "",
      name: "",
      type: "degree",
      issueDate: "",
      issuer: "",
      description: "",
      status: "active",
      file: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm bằng cấp/chứng chỉ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin bằng cấp/chứng chỉ của nhân viên
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Tên nhân viên</Label>
              <Input
                id="employeeName"
                placeholder="Nhập tên nhân viên"
                value={newCertificate.employeeName}
                onChange={(e) =>
                  setNewCertificate({
                    ...newCertificate,
                    employeeName: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Mã nhân viên</Label>
              <Input
                id="employeeId"
                placeholder="Nhập mã nhân viên"
                value={newCertificate.employeeId}
                onChange={(e) =>
                  setNewCertificate({
                    ...newCertificate,
                    employeeId: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên bằng cấp/chứng chỉ</Label>
              <Input
                id="name"
                placeholder="Nhập tên bằng cấp/chứng chỉ"
                value={newCertificate.name}
                onChange={(e) =>
                  setNewCertificate({ ...newCertificate, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <Select
                value={newCertificate.type}
                onValueChange={(value) =>
                  setNewCertificate({
                    ...newCertificate,
                    type: value as "degree" | "certificate",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">Bằng cấp</SelectItem>
                  <SelectItem value="certificate">Chứng chỉ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Ngày cấp</Label>
              <Input
                id="issueDate"
                type="date"
                value={newCertificate.issueDate}
                onChange={(e) =>
                  setNewCertificate({
                    ...newCertificate,
                    issueDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Đơn vị cấp</Label>
              <Input
                id="issuer"
                placeholder="Nhập đơn vị cấp"
                value={newCertificate.issuer}
                onChange={(e) =>
                  setNewCertificate({
                    ...newCertificate,
                    issuer: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={newCertificate.status}
                onValueChange={(value) =>
                  setNewCertificate({
                    ...newCertificate,
                    status: value as "active" | "expired" | "pending",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hiện hành</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Hình ảnh bằng cấp/chứng chỉ</Label>
            <div className="flex flex-col items-center gap-4 rounded-md border border-dashed p-4">
              {newCertificate.file ? (
                <div className="relative w-full">
                  {newCertificate.file.endsWith(".pdf") ? (
                    <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <p className="ml-2">PDF Document</p>
                    </div>
                  ) : (
                    <img
                      src={newCertificate.file}
                      alt="Preview"
                      className="max-h-[200px] w-full object-contain rounded-md"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Kéo và thả hoặc nhấp để tải lên
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Đang tải lên..." : "Chọn tệp"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Thêm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
