import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Vaccination {
  id: string;
  employeeId: string;
  name: string;
  date: string;
  location: string;
  notes?: string;
  fileUrl?: string | null;
  nextDose?: string | null;
}

interface VaccinationDetailProps {
  vaccination: Vaccination;
  onViewFile?: (file: string) => void;
}

export function VaccinationDetail({
  vaccination,
  onViewFile,
}: VaccinationDetailProps) {
  return (
    <div className="space-y-4 mt-6">
      <div>
        <h3 className="font-medium text-lg">{vaccination.name}</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Ngày tiêm
            </p>
            <p>{new Date(vaccination.date).toLocaleDateString("vi-VN")}</p>
          </div>
          {vaccination.nextDose && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ngày tiêm tiếp theo
              </p>
              <p>
                {new Date(vaccination.nextDose).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Địa điểm tiêm
        </p>
        <p>{vaccination.location}</p>
      </div>

      {vaccination.notes && (
        <>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
            <p>{vaccination.notes}</p>
          </div>
        </>
      )}

      {vaccination.fileUrl && (
        <>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Tài liệu đính kèm
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center p-2 border rounded-md flex-1">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm truncate">Phiếu tiêm chủng</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewFile?.(vaccination.fileUrl!)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Xem
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
