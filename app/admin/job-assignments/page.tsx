"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { jobColumns } from "@/components/admin-job/JobColumns";
import { ViewJobDialog } from "@/components/admin-job/ViewJobDialog";
import { AddJobDialog } from "@/components/admin-job/AddJobDialog";
import { EditJobDialog } from "@/components/admin-job/EditJobDialog";
import { ViewFileDialog } from "@/components/admin-job/ViewFileDialog";
import { JobFilters } from "@/components/admin-job/JobFilters";
import { useJobStore } from "@/stores/use-job-store";
import type { JobAssignment } from "@/types";

export default function JobAssignmentsPage() {
  const { toast, currentToast, dismissToast } = useToast();
  const { assignments, addAssignment, updateAssignment, deleteAssignment } =
    useJobStore();

  const [selectedJob, setSelectedJob] = useState<JobAssignment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewFileDialogOpen, setIsViewFileDialogOpen] = useState(false);

  const initialNewJob: Omit<JobAssignment, "id"> = {
    title: "",
    employeeName: "",
    employeeId: "",
    department: "",
    assignDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "active",
    description: "",
    file: null,
  };

  const handleViewJob = (job: JobAssignment) => {
    setSelectedJob(job);
    setIsViewDialogOpen(true);
  };

  const handleEditJob = (job: JobAssignment) => {
    setSelectedJob(job);
    setIsEditDialogOpen(true);
  };

  const handleViewFile = (job: JobAssignment) => {
    setSelectedJob(job);
    setIsViewFileDialogOpen(true);
  };

  const handleDeleteJob = (id: string) => {
    deleteAssignment(id);
    setIsViewDialogOpen(false);
    toast({
      title: "Xóa thành công",
      description: "Công việc đã được xóa khỏi hệ thống",
      duration: 3000,
    });
  };

  const handleAddJob = (data: Omit<JobAssignment, "id">) => {
    const job = {
      ...data,
      id: Date.now().toString(),
    };

    addAssignment(job);
    setIsAddDialogOpen(false);

    toast({
      title: "Thêm thành công",
      description: `Đã thêm công việc cho ${data.employeeName}`,
      duration: 3000,
    });
  };

  const handleEditJobSubmit = (data: JobAssignment) => {
    updateAssignment(data.id, data);
    setIsEditDialogOpen(false);

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật công việc cho ${data.employeeName}`,
      duration: 3000,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Giao việc</h1>
            <p className="text-muted-foreground">
              Quản lý và giao việc cho nhân viên
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Giao việc mới
          </Button>
        </div>

        <JobFilters
          data={assignments}
          columns={jobColumns({
            onView: handleViewJob,
            onEdit: handleEditJob,
            onDelete: handleDeleteJob,
          })}
        />
      </div>

      <ViewJobDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        job={selectedJob}
        onDelete={handleDeleteJob}
        onEdit={handleEditJob}
        onViewFile={handleViewFile}
      />

      <EditJobDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditJobSubmit}
        job={selectedJob}
      />

      <AddJobDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddJob}
        initialData={initialNewJob}
      />

      <ViewFileDialog
        open={isViewFileDialogOpen}
        onOpenChange={setIsViewFileDialogOpen}
        file={selectedJob?.file || null}
        fileName={
          selectedJob?.file instanceof File
            ? selectedJob.file.name
            : selectedJob?.title || "Tài liệu"
        }
      />

      <ToastProvider>
        {currentToast && (
          <Toast variant="success" onClose={dismissToast}>
            <ToastTitle>{currentToast.title}</ToastTitle>
            {currentToast.description && (
              <ToastDescription>{currentToast.description}</ToastDescription>
            )}
          </Toast>
        )}
      </ToastProvider>
    </>
  );
}
