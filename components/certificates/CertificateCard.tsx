import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2 } from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  issuer: string;
  description: string;
  file: string | null;
}

interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export function CertificateCard({
  certificate,
  onView,
  onDelete,
}: CertificateCardProps) {
  return (
    <Card key={certificate.id} className="overflow-hidden">
      <div className="aspect-video bg-muted">
        {certificate.file ? (
          <img
            src={certificate.file || "/placeholder.svg"}
            alt={certificate.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{certificate.name}</CardTitle>
        <CardDescription>
          {certificate.type === "degree"
            ? "Bằng cấp"
            : certificate.type === "certificate"
            ? "Chứng chỉ hành nghề"
            : "Khác"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Ngày cấp:</span>
          <span className="text-sm">
            {new Date(certificate.issueDate).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Đơn vị cấp:</span>
          <span className="text-sm">{certificate.issuer}</span>
        </div>
        {certificate.description && (
          <p className="text-sm text-muted-foreground">
            {certificate.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onView(certificate)}>
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </Button>
        <Button variant="destructive" onClick={() => onDelete(certificate.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
}
