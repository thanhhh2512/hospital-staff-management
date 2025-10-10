import { Button } from "@/components/ui/button";
import { Download, Plus, Loader2 } from "lucide-react";

interface TrainingToolbarProps {
  isLoading: boolean;
  onAddClick: () => void;
  onDownloadPDF: () => void;
}

export function TrainingToolbar({
  isLoading,
  onAddClick,
  onDownloadPDF,
}: TrainingToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quá trình đào tạo</h1>
        <p className="text-muted-foreground">
          Quản lý quá trình đào tạo và học tập
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onDownloadPDF} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Tải PDF
            </>
          )}
        </Button>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm quá trình đào tạo
        </Button>
      </div>
    </div>
  );
}
