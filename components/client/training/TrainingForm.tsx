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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrainingHistory } from "@/types";

interface TrainingFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    training: Omit<TrainingHistory, "id" | "createdAt" | "updatedAt">
  ) => void;
  training?: TrainingHistory;
}

export function TrainingForm({
  open,
  onClose,
  onSave,
  training,
}: TrainingFormProps) {
  const [formData, setFormData] = useState<
    Omit<TrainingHistory, "id" | "createdAt" | "updatedAt">
  >({
    employeeId: training?.employeeId || "",
    school: training?.school || "",
    major: training?.major || "",
    startDate: training?.startDate || "",
    endDate: training?.endDate || "",
    type: training?.type || "COURSE",
    degree: training?.degree || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
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
            {training ? "Chỉnh sửa" : "Thêm"} quá trình đào tạo
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin về quá trình đào tạo, bồi dưỡng
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="school">Tên trường</Label>
            <Input
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="major">Chuyên ngành đào tạo, bồi dưỡng</Label>
            <Input
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Từ ngày</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Loại đào tạo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại đào tạo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEGREE">Bằng cấp</SelectItem>
                <SelectItem value="CERTIFICATE">Chứng chỉ</SelectItem>
                <SelectItem value="COURSE">Khóa học</SelectItem>
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="degree">Văn bằng, chứng chỉ</Label>
            <Input
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="Cử nhân, Thạc sĩ, Chứng chỉ ABC, v.v."
              required
            />
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
