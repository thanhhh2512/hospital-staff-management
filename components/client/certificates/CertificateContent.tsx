"use client";

import { useState, useRef, useEffect } from "react";
import {
  CertificateHeader,
  CertificateList,
  CertificateForm,
  CertificateDetail,
} from "@/components/client/certificates";
import { generatePDF } from "@/components//client/profile/pdfUtils";
import { useCertificateStore } from "@/stores/use-certificate-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { PrintContainer } from "@/components/ui/print-container";
import type { Certificate } from "@/types";
import { toast } from "sonner";

export default function CertificateContent() {
  // Auth store for getting current user
  const { user } = useAuthStore();

  // Certificate store
  const {
    certificates,
    selectedCertificate,
    isLoading: certificatesLoading,
    error: certificatesError,
    pagination,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    selectCertificate,
    clearError: clearCertificatesError,
  } = useCertificateStore();

  // Local state for UI
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Loading state
  const isLoading = certificatesLoading;

  const certificatesRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch certificates on mount
  useEffect(() => {
    if (user?.employeeId) {
      // Fetch only certificates for the current user
      fetchCertificates({ employeeId: user.employeeId });
    }
  }, [fetchCertificates, user?.employeeId]);

  // Clear errors after timeout
  useEffect(() => {
    if (certificatesError) {
      const timer = setTimeout(() => {
        clearCertificatesError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [certificatesError, clearCertificatesError]);

  const handleAddCertificate = () => {
    selectCertificate(null);
    setIsCertificateFormOpen(true);
  };

  const handleViewCertificate = (certificate: Certificate) => {
    selectCertificate(certificate);
    setIsDetailOpen(true);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    selectCertificate(certificate);
    setIsCertificateFormOpen(true);
  };

  // Helper function to convert Certificate to CertificateFormData
  const certificateToFormData = (
    cert: Omit<Certificate, "id"> & { certificateFile?: File }
  ): any => {
    return {
      employeeId: user?.employeeId || cert.employeeId || "", // Use current user's employeeId
      name: cert.name,
      type: cert.type.toUpperCase() as "DEGREE" | "CERTIFICATE" | "OTHER",
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      status: cert.status?.toUpperCase() as "ACTIVE" | "EXPIRED" | "SUSPENDED",
      description: cert.description,
      certificate: cert.certificateFile, // Pass the actual File object
    };
  };

  const handleSaveCertificate = async (
    formData: Omit<Certificate, "id"> & { certificateFile?: File }
  ) => {
    // Validate that user is logged in and has employeeId
    if (!user?.employeeId) {
      toast.error("Không thể tạo chứng chỉ: thiếu thông tin người dùng");
      return;
    }

    let success = false;

    if (selectedCertificate) {
      // Convert Certificate to CertificateFormData format
      const updateData = certificateToFormData(formData);
      success = await updateCertificate(selectedCertificate.id, updateData);
      if (success) {
        toast.success("Chứng chỉ đã được cập nhật thành công");
      }
    } else {
      // Convert Certificate to CertificateFormData format
      const createData = certificateToFormData(formData);
      success = await createCertificate(createData);
      if (success) {
        toast.success("Chứng chỉ đã được tạo thành công");
      }
    }

    if (success) {
      setIsCertificateFormOpen(false);
      if (user?.employeeId) {
        fetchCertificates({ employeeId: user.employeeId }); // Refresh the list
      }
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
      <div className="space-y-6" ref={certificatesRef}>
        <CertificateHeader
          isLoading={isLoading}
          onAddClick={handleAddCertificate}
          onDownloadPDF={handleDownloadPDF}
        />

        {/* Error Display */}
        {certificatesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Đã xảy ra lỗi:</p>
            <p className="text-sm">Chứng chỉ: {certificatesError}</p>
          </div>
        )}

        <div className="space-y-4">
          <CertificateList
            certificates={certificates}
            onView={handleViewCertificate}
            isLoading={certificatesLoading}
          />
        </div>
      </div>

      <div className="hidden">
        <PrintContainer ref={printRef}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                Bằng cấp & Chứng chỉ
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border p-4 rounded">
                    <h3 className="font-bold">{cert.name}</h3>
                    <p>
                      Loại:{" "}
                      {cert.type === "DEGREE"
                        ? "Bằng cấp"
                        : cert.type === "CERTIFICATE"
                        ? "Chứng chỉ hành nghề"
                        : "Khác"}
                    </p>
                    <p>
                      Ngày cấp:{" "}
                      {new Date(cert.issueDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p>Đơn vị cấp: {cert.issuer}</p>
                    {cert.description && <p>Mô tả: {cert.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PrintContainer>
      </div>

      {isCertificateFormOpen && (
        <CertificateForm
          open={isCertificateFormOpen}
          onClose={() => setIsCertificateFormOpen(false)}
          onSave={handleSaveCertificate}
          certificate={selectedCertificate || undefined}
        />
      )}

      {isDetailOpen && selectedCertificate && (
        <CertificateDetail
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          certificate={selectedCertificate}
          onEdit={handleEditCertificate}
        />
      )}
    </>
  );
}
