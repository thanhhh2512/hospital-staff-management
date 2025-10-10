import { Button } from "@/components/ui/button";
import { Download, Plus, Loader2 } from "lucide-react";

interface CertificateHeaderProps {
  isLoading: boolean;
  onAddClick: () => void;
  onDownloadPDF: () => void;
}

export function CertificateHeader({
  isLoading,
  onAddClick,
  onDownloadPDF,
}: CertificateHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bằng cấp & Chứng chỉ
        </h1>
        <p className="text-muted-foreground">
          Quản lý bằng cấp và chứng chỉ hành nghề
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onDownloadPDF}
          disabled={isLoading}
        >
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
          Thêm bằng cấp/chứng chỉ
        </Button>
      </div>
    </div>
  );
} 