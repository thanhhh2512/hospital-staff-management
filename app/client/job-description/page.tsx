"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import {
  JobDescriptionHeader,
  JobDescriptionCard,
  JobDescriptionViewer,
  EmptyState,
} from "@/components/client/job-description";
import { useJobStore } from "@/stores";
import type { JobDescription } from "@/types";

export default function JobDescriptionPage() {
  const { descriptions } = useJobStore();
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewJob = (job: JobDescription) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <JobDescriptionHeader />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {descriptions.map((job: JobDescription) => (
          <JobDescriptionCard
            key={job.id}
            job={job}
            onView={() => handleViewJob(job)}
          />
        ))}
      </div>

      {descriptions.length === 0 && <EmptyState />}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <JobDescriptionViewer
          job={selectedJob}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </Dialog>
    </div>
  );
}
