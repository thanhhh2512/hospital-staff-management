import { CertificateCard } from "./CertificateCard";

interface Certificate {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  issuer: string;
  description: string;
  file: string | null;
}

interface CertificateListProps {
  certificates: Certificate[];
  onView: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export function CertificateList({
  certificates,
  onView,
  onDelete,
}: CertificateListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 