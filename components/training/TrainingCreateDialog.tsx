import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrainingForm } from "@/components/training/TrainingForm";
import type { TrainingHistory } from "@/types";

interface TrainingCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    formData: Omit<TrainingHistory, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  training?: TrainingHistory;
}

export function TrainingCreateDialog({
  open,
  onClose,
  onSave,
  training,
}: TrainingCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {training
              ? "Chỉnh sửa quá trình đào tạo"
              : "Thêm quá trình đào tạo"}
          </DialogTitle>
        </DialogHeader>
        <TrainingForm
          open={open}
          onClose={onClose}
          onSave={onSave}
          training={training}
        />
      </DialogContent>
    </Dialog>
  );
}
