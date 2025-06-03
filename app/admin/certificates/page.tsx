"use client";

import { useState } from "react";
import { CertificateList } from "@/components/admin-certificates/CertificateList";
import type { Certificate } from "@/types";
import { mockCertificates } from "@/schemas/mock-data";

export default function CertificatesPage() {
  const [certificates, setCertificates] =
    useState<Certificate[]>(mockCertificates);

  const handleAdd = (certificate: Omit<Certificate, "id">) => {
    const newCertificate = {
      ...certificate,
      id: Date.now().toString(),
    };
    setCertificates([...certificates, newCertificate]);
  };

  const handleDelete = (id: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };

  return (

      <CertificateList
        certificates={certificates}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />

  );
}
