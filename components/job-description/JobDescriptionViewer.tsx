import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JobDescription } from "./types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface JobDescriptionViewerProps {
  job: JobDescription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDescriptionViewer({
  job,
  open,
  onOpenChange,
}: JobDescriptionViewerProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>
            {job.department} - Ngày tải lên:{" "}
            {new Date(job.uploadDate).toLocaleDateString("vi-VN")}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <MarkdownRenderer content={job.content} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 