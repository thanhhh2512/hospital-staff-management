"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { VaccinationCard } from "@/components/vaccination/VaccinationCard";
import { VaccinationForm } from "@/components/vaccination/VaccinationForm";
import { VaccinationDetail } from "@/components/vaccination/VaccinationDetail";
import {
  Certificate,
  Vaccination,
  VaccinationFormData,
} from "@/types";
import {mockCertificates, mockVaccinations} from "@/schemas/mock-data";

export default function VaccinationPage() {
  const { toast } = useToast();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations);

  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [vaccinationToDelete, setVaccinationToDelete] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

  const handleSubmit = async (data: VaccinationFormData, file: File | null) => {
    setIsSubmitting(true);

    try {
      let fileUrl: string | null = null;
      if (file) {
        const reader = new FileReader();
        fileUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newVaccination: Vaccination = {
        id: Date.now().toString(),
        ...data,
        file: fileUrl,
      };

      setVaccinations((prev) => [...prev, newVaccination]);
      setIsAddDialogOpen(false);

      toast({
        title: "Thêm thành công",
        description: "Đã thêm phiếu tiêm chủng mới",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi thêm phiếu tiêm chủng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setVaccinationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVaccination = async () => {
    if (!vaccinationToDelete) return;

    setIsDeleting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setVaccinations((prev) =>
        prev.filter((v) => v.id !== vaccinationToDelete)
      );
      setIsDeleteDialogOpen(false);
      setVaccinationToDelete(null);

      toast({
        title: "Xóa thành công",
        description: "Đã xóa phiếu tiêm chủng",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi xóa phiếu tiêm chủng",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDetailClick = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsDetailOpen(true);
  };

  const handleViewFile = (fileUrl: string) => {
    setFilePreviewUrl(fileUrl);
    setIsFilePreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Phiếu tiêm chủng
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tiêm chủng của bạn
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm phiếu tiêm chủng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm phiếu tiêm chủng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết về mũi tiêm để quản lý lịch sử tiêm
                chủng
              </DialogDescription>
            </DialogHeader>

            <VaccinationForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách phiếu tiêm chủng */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vaccinations.map((vaccination) => (
          <VaccinationCard
            key={vaccination.id}
            vaccination={vaccination}
            onDelete={handleDeleteClick}
            onViewDetail={handleDetailClick}
          />
        ))}
      </div>

      {/* Sheet hiển thị chi tiết */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Thông tin tiêm chủng</SheetTitle>
            <SheetDescription>
              Xem chi tiết phiếu tiêm chủng và chứng chỉ liên quan
            </SheetDescription>
          </SheetHeader>

          {selectedVaccination && (
            <VaccinationDetail
              vaccination={selectedVaccination}
              certificates={certificates}
              onViewFile={handleViewFile}
            />
          )}

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog xem file */}
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Xem tài liệu</DialogTitle>
          </DialogHeader>
          <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-md">
            {filePreviewUrl && (
              <img
                src={filePreviewUrl}
                alt="Tài liệu"
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert dialog xác nhận xóa */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phiếu tiêm chủng này? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteVaccination();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
