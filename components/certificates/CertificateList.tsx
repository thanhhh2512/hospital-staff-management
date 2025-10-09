import { CertificateCard } from "./CertificateCard";
import { Loader2 } from "lucide-react";
import type { Certificate } from "@/types";

interface CertificateListProps {
  certificates: Certificate[];
  onView: (certificate: Certificate) => void;
  isLoading?: boolean;
}

export function CertificateList({
  certificates,
  onView,
  isLoading = false,
}: CertificateListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải chứng chỉ...</span>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Chưa có chứng chỉ nào được thêm.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Nhấn nút "Thêm chứng chỉ" để bắt đầu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onView={onView}
        />
      ))}
    </div>
  );
}
