import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  issuer: string;
  description: string;
  file: string | null;
}

interface CertificateFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (certificate: Omit<Certificate, "id">) => void;
  certificate?: Certificate;
}

export function CertificateForm({
  open,
  onClose,
  onSave,
  certificate,
}: CertificateFormProps) {
  const [formData, setFormData] = useState<Omit<Certificate, "id">>({
    name: certificate?.name || "",
    type: certificate?.type || "degree",
    issueDate: certificate?.issueDate || new Date().toISOString().split("T")[0],
    issuer: certificate?.issuer || "",
    description: certificate?.description || "",
    file: certificate?.file || null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    certificate?.file || null
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setFormData({ ...formData, file: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {certificate ? "Chỉnh sửa" : "Thêm"} bằng cấp/chứng chỉ
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin bằng cấp hoặc chứng chỉ hành nghề
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên bằng cấp/chứng chỉ</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Loại</Label>
            <Select value={formData.type} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="degree">Bằng cấp</SelectItem>
                <SelectItem value="certificate">Chứng chỉ hành nghề</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issueDate">Ngày cấp</Label>
            <Input
              id="issueDate"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issuer">Đơn vị cấp</Label>
            <Input
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">Tải lên ảnh</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Chọn tệp
              </Button>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl && (
                <div className="h-16 w-16 overflow-hidden rounded border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
