import { Button } from "@/components/ui/button";
import { Save, Download, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  isLoading: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDownloadPDF: () => void;
}

export function ProfileHeader({
  isLoading,
  isSaving,
  onSave,
  onDownloadPDF,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lý lịch cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân của bạn
        </p>
      </div>
      <div className="flex gap-2">
        {/* <Button variant="outline" onClick={onDownloadPDF} disabled={isLoading}>
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
        </Button> */}
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
