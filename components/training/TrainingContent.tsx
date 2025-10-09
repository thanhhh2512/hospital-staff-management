"use client";

import { useState, useRef, useEffect } from "react";
import {
  TrainingToolbar,
  TrainingTable,
  TrainingCreateDialog,
  TrainingDeleteDialog,
} from "@/components/training";
import { generatePDF } from "@/components/profile/pdfUtils";
import { useTrainingStore } from "@/stores/use-training-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { PrintContainer } from "@/components/ui/print-container";
import type { TrainingHistory } from "@/types";
import { toast } from "sonner";

export default function TrainingContent() {
  // Auth store for getting current user
  const { user } = useAuthStore();

  // Training store
  const {
    trainings: trainingHistory,
    selectedTraining,
    isLoading: trainingsLoading,
    error: trainingsError,
    fetchTrainingsByEmployeeId,
    createTraining,
    updateTraining,
    deleteTraining,
    selectTraining,
    clearError: clearTrainingsError,
  } = useTrainingStore();

  // Local state for UI
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] =
    useState<TrainingHistory | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Fetch trainings on mount
  useEffect(() => {
    if (user?.employeeId) {
      fetchTrainingsByEmployeeId(user.employeeId);
    }
  }, [fetchTrainingsByEmployeeId, user?.employeeId]);

  // Clear errors after timeout
  useEffect(() => {
    if (trainingsError) {
      const timer = setTimeout(() => {
        clearTrainingsError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [trainingsError, clearTrainingsError]);

  const handleAddTraining = () => {
    selectTraining(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditTraining = (training: TrainingHistory) => {
    selectTraining(training);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteTraining = (training: TrainingHistory) => {
    setTrainingToDelete(training);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!trainingToDelete) return;

    const success = await deleteTraining(trainingToDelete.id);
    if (success) {
      toast.success("Quá trình đào tạo đã được xóa thành công");
      setIsDeleteDialogOpen(false);
      setTrainingToDelete(null);
    }
  };

  const handleSaveTraining = async (
    formData: Omit<TrainingHistory, "id" | "createdAt" | "updatedAt">
  ) => {
    // Validate that user is logged in and has employeeId
    if (!user?.employeeId) {
      toast.error(
        "Không thể tạo quá trình đào tạo: thiếu thông tin người dùng"
      );
      return;
    }

    let success = false;

    // Ensure employeeId is set from current user
    const trainingDataWithEmployeeId = {
      ...formData,
      employeeId: user.employeeId,
    };

    if (selectedTraining) {
      success = await updateTraining(
        selectedTraining.id,
        trainingDataWithEmployeeId
      );
      if (success) {
        toast.success("Quá trình đào tạo đã được cập nhật thành công");
      }
    } else {
      success = await createTraining(trainingDataWithEmployeeId);
      if (success) {
        toast.success("Quá trình đào tạo đã được tạo thành công");
      }
    }

    if (success) {
      setIsCreateDialogOpen(false);
      // Note: No need to refetch the list - the store handles upsert after API calls
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(printRef.current);
      toast.success("PDF đã được tạo thành công");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Lỗi khi tạo PDF");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <TrainingToolbar
          isLoading={trainingsLoading}
          onAddClick={handleAddTraining}
          onDownloadPDF={handleDownloadPDF}
        />

        {/* Error Display */}
        {trainingsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Đã xảy ra lỗi:</p>
            <p className="text-sm">Đào tạo: {trainingsError}</p>
          </div>
        )}

        <div className="space-y-4">
          <TrainingTable
            trainingHistory={trainingHistory}
            onAddClick={handleAddTraining}
            onEditClick={handleEditTraining}
            onDeleteClick={handleDeleteTraining}
            isLoading={trainingsLoading}
          />
        </div>
      </div>

      {/* Hidden print container */}
      <div className="hidden">
        <PrintContainer ref={printRef}>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Quá trình đào tạo
            </h1>
            <div className="space-y-4">
              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">Tên trường</th>
                    <th className="border p-2">Chuyên ngành</th>
                    <th className="border p-2">Thời gian</th>
                    <th className="border p-2">Hình thức</th>
                    <th className="border p-2">Văn bằng</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2">{item.school}</td>
                      <td className="border p-2">{item.major}</td>
                      <td className="border p-2">
                        {item.startDate} - {item.endDate || "Hiện tại"}
                      </td>
                      <td className="border p-2">
                        {item.type === "DEGREE"
                          ? "Bằng cấp"
                          : item.type === "CERTIFICATE"
                          ? "Chứng chỉ"
                          : item.type === "COURSE"
                          ? "Khóa học"
                          : "Khác"}
                      </td>
                      <td className="border p-2">{item.degree}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PrintContainer>
      </div>

      {/* Training Create/Edit Dialog */}
      {isCreateDialogOpen && (
        <TrainingCreateDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSave={handleSaveTraining}
          training={selectedTraining || undefined}
        />
      )}

      {/* Training Delete Dialog */}
      <TrainingDeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        training={trainingToDelete}
      />
    </>
  );
}
