import { Award, Calendar, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Certificate } from "./types";

interface CertificateListProps {
  certificates: Certificate[];
  onViewFile?: (file: string) => void;
}

export function CertificateList({
  certificates,
  onViewFile,
}: CertificateListProps) {
  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Award className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-medium">Không có bằng cấp/chứng chỉ</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Chưa có bằng cấp hoặc chứng chỉ nào liên quan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <Card key={certificate.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{certificate.name}</CardTitle>
              <Award className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Ngày cấp:{" "}
                  {new Date(certificate.issueDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm">Nơi cấp: {certificate.issuer}</p>
            {certificate.expiryDate && (
              <Badge className="mt-2">
                Hết hạn:{" "}
                {new Date(certificate.expiryDate).toLocaleDateString("vi-VN")}
              </Badge>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            {certificate.file ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => onViewFile?.(certificate.file!)}
              >
                <FileImage className="h-4 w-4" />
                Xem
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Không có tệp đính kèm
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
