"use client";

import { useState, useRef } from "react";
import {
  CertificateHeader,
  CertificateList,
  CertificateForm,
  CertificateDetail,
  TrainingTable,
  TrainingForm,
  DeleteConfirmation,
} from "@/components/certificates";
import { generatePDF } from "@/components/profile/pdfUtils";
import { useCertificateStore } from "@/stores/useCertificateStore";
import { PrintContainer } from "@/components/ui/print-container";
import type { Certificate, TrainingHistory } from "@/types";

export default function CertificatesPage() {
  const {
    certificates,
    trainingHistory,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addTraining,
    updateTraining,
    deleteTraining,
  } = useCertificateStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);
  const [isTrainingFormOpen, setIsTrainingFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [selectedTraining, setSelectedTraining] =
    useState<TrainingHistory | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"certificate" | "training">(
    "certificate"
  );

  const certificatesRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleAddCertificate = () => {
    setSelectedCertificate(null);
    setIsCertificateFormOpen(true);
  };

  const handleAddTraining = () => {
    setSelectedTraining(null);
    setIsTrainingFormOpen(true);
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDetailOpen(true);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsCertificateFormOpen(true);
  };

  const handleDeleteCertificate = (id: string) => {
    setItemToDelete(id);
    setDeleteType("certificate");
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (deleteType === "certificate") {
      deleteCertificate(itemToDelete);
    } else {
      deleteTraining(itemToDelete);
    }

    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSaveCertificate = (formData: Omit<Certificate, "id">) => {
    if (selectedCertificate) {
      updateCertificate(selectedCertificate.id, formData);
    } else {
      addCertificate(formData);
    }
    setIsCertificateFormOpen(false);
  };

  const handleSaveTraining = (formData: Omit<TrainingHistory, "id">) => {
    if (selectedTraining) {
      updateTraining(selectedTraining.id, formData);
    } else {
      addTraining(formData);
    }
    setIsTrainingFormOpen(false);
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      await generatePDF(printRef.current);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
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

        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Bằng cấp & Chứng chỉ
            </h2>
            <CertificateList
              certificates={certificates}
              onView={handleViewCertificate}
              onDelete={handleDeleteCertificate}
            />
          </div>

          <TrainingTable
            trainingHistory={trainingHistory}
            onAddClick={handleAddTraining}
          />
        </div>
      </div>

      <div className="hidden">
        <PrintContainer ref={printRef}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Bằng cấp & Chứng chỉ
              </h1>
              <p className="text-gray-700">
                Quản lý bằng cấp và chứng chỉ hành nghề
              </p>
            </div>

            <div className="space-y-10">
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
                        {cert.type === "degree"
                          ? "Bằng cấp"
                          : cert.type === "certificate"
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

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">
                  Quá trình đào tạo
                </h2>
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
                          {item.startDate} - {item.endDate}
                        </td>
                        <td className="border p-2">{item.type}</td>
                        <td className="border p-2">{item.degree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {isTrainingFormOpen && (
        <TrainingForm
          open={isTrainingFormOpen}
          onClose={() => setIsTrainingFormOpen(false)}
          onSave={handleSaveTraining}
          training={selectedTraining || undefined}
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

      <DeleteConfirmation
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Xóa ${
          deleteType === "certificate"
            ? "bằng cấp/chứng chỉ"
            : "quá trình đào tạo"
        }`}
        description={`Bạn có chắc chắn muốn xóa ${
          deleteType === "certificate"
            ? "bằng cấp/chứng chỉ"
            : "quá trình đào tạo"
        } này? Hành động này không thể hoàn tác.`}
      />
    </>
  );
}
