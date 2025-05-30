import React from "react";

interface JobDescriptionHeaderProps {
  title?: string;
  description?: string;
}

export function JobDescriptionHeader({
  title = "Mô tả công việc",
  description = "Xem mô tả công việc và quy trình làm việc",
}: JobDescriptionHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
} 