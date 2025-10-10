"use client";

import { useState, useEffect } from "react";
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
import { VaccinationCard } from "@/components/client/vaccination/VaccinationCard";
import { VaccinationForm } from "@/components/client/vaccination/VaccinationForm";
import { VaccinationDetail } from "@/components/client/vaccination/VaccinationDetail";
import { useVaccinationStore } from "@/stores/use-vaccination-store";
import { useAuthStore } from "@/stores/use-auth-store";

interface VaccinationFormData {
  name: string;
  date: string;
  location: string;
  notes?: string;
  nextDose?: string;
}

export default function VaccinationPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const {
    vaccinations,
    selectedVaccination,
    isLoading,
    fetchByEmployeeId,
    createVaccination,
    deleteVaccination,
    selectVaccination,
  } = useVaccinationStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [vaccinationToDelete, setVaccinationToDelete] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

  useEffect(() => {
    if (user?.employeeId) {
      fetchByEmployeeId(user.employeeId);
    }
  }, [user?.employeeId, fetchByEmployeeId]);

  const handleSubmit = async (data: VaccinationFormData, file: File | null) => {
    if (!user?.employeeId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin nhân viên",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...data,
      employeeId: user.employeeId,
      file: file || undefined,
    };

    const success = await createVaccination(formData);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setVaccinationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVaccination = async () => {
    if (!vaccinationToDelete) return;
    const success = await deleteVaccination(vaccinationToDelete);
    if (success) {
      setIsDeleteDialogOpen(false);
      setVaccinationToDelete(null);
    }
  };

  const handleDetailClick = (vaccination: any) => {
    selectVaccination(vaccination);
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              isSubmitting={isLoading}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

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

      {!isLoading && vaccinations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chưa có phiếu tiêm chủng nào</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Thông tin tiêm chủng</SheetTitle>
            <SheetDescription>Xem chi tiết phiếu tiêm chủng</SheetDescription>
          </SheetHeader>
          {selectedVaccination && (
            <VaccinationDetail
              vaccination={selectedVaccination}
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
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteVaccination();
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
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
