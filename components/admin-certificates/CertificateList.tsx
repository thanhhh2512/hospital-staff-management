import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/hooks/use-toast";
import { getCertificateColumns } from "./CertificateColumns";
import { CertificateViewDialog } from "./CertificateViewDialog";
import { CertificateAddDialog } from "./CertificateAddDialog";
import type { Certificate } from "@/types";

interface CertificateListProps {
  certificates: Certificate[];
  onAdd: (certificate: Omit<Certificate, "id">) => void;
  onDelete: (id: string) => void;
}

export function CertificateList({
  certificates,
  onAdd,
  onDelete,
}: CertificateListProps) {
  const { toast } = useToast();
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAdd = (certificate: Omit<Certificate, "id">) => {
    onAdd(certificate);
    setIsAddDialogOpen(false);
    toast({
      title: "Thêm thành công",
      description: "Bằng cấp/chứng chỉ đã được thêm vào hệ thống",
      duration: 3000,
    });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setIsViewDialogOpen(false);
    toast({
      title: "Xóa thành công",
      description: "Bằng cấp/chứng chỉ đã được xóa khỏi hệ thống",
      duration: 3000,
    });
  };

  const columns = getCertificateColumns({
    onView: (certificate) => {
      setSelectedCertificate(certificate);
      setIsViewDialogOpen(true);
    },
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý bằng cấp & chứng chỉ
          </h1>
          <p className="text-muted-foreground">
            Quản lý bằng cấp và chứng chỉ hành nghề của nhân viên
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bằng cấp/chứng chỉ
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="active">Hiện hành</TabsTrigger>
          <TabsTrigger value="expired">Hết hạn</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <DataTable
            columns={columns}
            data={certificates}
            searchColumn="employeeName"
            searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <DataTable
            columns={columns}
            data={certificates.filter((cert) => cert.status === "active")}
            searchColumn="employeeName"
            searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          />
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          <DataTable
            columns={columns}
            data={certificates.filter((cert) => cert.status === "expired")}
            searchColumn="employeeName"
            searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <DataTable
            columns={columns}
            data={certificates.filter((cert) => cert.status === "pending")}
            searchColumn="employeeName"
            searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          />
        </TabsContent>
      </Tabs>

      <CertificateViewDialog
        certificate={selectedCertificate}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onDelete={handleDelete}
      />

      <CertificateAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
      />
    </div>
  );
}
