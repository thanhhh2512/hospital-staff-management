import { FileText } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Không có mô tả công việc",
  description = "Chưa có mô tả công việc nào được tải lên",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
} 