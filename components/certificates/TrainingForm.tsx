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
import type { TrainingHistory } from "@/types";

interface TrainingFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (training: Omit<TrainingHistory, "id">) => void;
  training?: TrainingHistory;
}

export function TrainingForm({
  open,
  onClose,
  onSave,
  training,
}: TrainingFormProps) {
  const [formData, setFormData] = useState<Omit<TrainingHistory, "id">>({
    school: training?.school || "",
    major: training?.major || "",
    startDate: training?.startDate || "",
    endDate: training?.endDate || "",
    type: training?.type || "",
    degree: training?.degree || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="major">Chuyên ngành đào tạo, bồi dưỡng</Label>
            <Input
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Từ tháng, năm</Label>
              <Input
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                placeholder="MM/YYYY"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Đến tháng, năm</Label>
              <Input
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                placeholder="MM/YYYY hoặc Hiện tại"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Hình thức đào tạo</Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Chính quy, Liên thông, v.v."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="degree">Văn bằng, chứng chỉ</Label>
            <Input
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="Cử nhân, Thạc sĩ, v.v."
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
