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
import type { Certificate } from "@/types";

interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
}

export function CertificateCard({
  certificate,
  onView,
}: CertificateCardProps) {
  console.log("Certificate", certificate)
  return (
    <Card key={certificate.id} className="overflow-hidden">
      <div className="aspect-video bg-muted">
        {certificate.fileUrl ? (
          <img
            src={certificate.fileUrl || "/placeholder.svg"}
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
          {certificate.type === "DEGREE"
            ? "Bằng cấp"
            : certificate.type === "CERTIFICATE"
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
      <CardFooter >
        <Button className="w-full" variant="outline" onClick={() => onView(certificate)}>
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
