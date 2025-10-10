import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Download } from "lucide-react";
import type { JobDescription } from "@/types";
import { generateJobDescriptionPDF } from "@/components/client/profile/pdfUtils";

interface JobDescriptionCardProps {
  job: JobDescription;
  onView: () => void;
}

export function JobDescriptionCard({ job, onView }: JobDescriptionCardProps) {
  const handleDownload = () => {
    generateJobDescriptionPDF(job);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{job.title}</CardTitle>
          <Badge variant={job.status === "active" ? "default" : "secondary"}>
            {job.status === "active" ? "Hiện hành" : "Không hoạt động"}
          </Badge>
        </div>
        <CardDescription>{job.department}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          Ngày tải lên: {new Date(job.uploadDate).toLocaleDateString("vi-VN")}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          Xem
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Tải xuống
        </Button>
      </CardFooter>
    </Card>
  );
}
