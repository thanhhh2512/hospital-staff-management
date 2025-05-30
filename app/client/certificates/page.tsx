"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { generatePDFWithPdfMake } from "@/components/profile/pdfmakeUtils";
import { PrintContainer } from "@/components/ui/print-container";

interface Certificate {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  issuer: string;
  description: string;
  file: string | null;
}

interface TrainingHistory {
  id: string;
  school: string;
  major: string;
  startDate: string;
  endDate: string;
  type: string;
  degree: string;
}

// Mock data
const mockCertificates: Certificate[] = [
  {
    id: "1",
    name: "Bằng Cử nhân Xét nghiệm",
    type: "degree",
    issueDate: "2012-10-30",
    issuer: "Trường ĐHYD.TP Hồ Chí Minh",
    description: "Tốt nghiệp loại Khá",
    file: null,
  },
  {
    id: "2",
    name: "Chứng chỉ hành nghề Xét nghiệm",
    type: "certificate",
    issueDate: "2013-05-15",
    issuer: "Bộ Y tế",
    description: "Chứng chỉ hành nghề cho kỹ thuật viên xét nghiệm",
    file: null,
  },
];

const mockTrainingHistory: TrainingHistory[] = [
  {
    id: "1",
    school: "Trường ĐHYD.TP Hồ Chí Minh",
    major: "Xét nghiệm",
    startDate: "11/2009",
    endDate: "10/2012",
    type: "Liên thông",
    degree: "Cử nhân",
  },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] =
    useState<Certificate[]>(mockCertificates);
  const [trainingHistory, setTrainingHistory] =
    useState<TrainingHistory[]>(mockTrainingHistory);

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
      setCertificates((prev) =>
        prev.filter((cert) => cert.id !== itemToDelete)
      );
    } else {
      setTrainingHistory((prev) =>
        prev.filter((train) => train.id !== itemToDelete)
      );
    }

    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSaveCertificate = (formData: Omit<Certificate, "id">) => {
    if (selectedCertificate) {
      // Edit existing
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === selectedCertificate.id
            ? { ...formData, id: cert.id }
            : cert
        )
      );
    } else {
      // Add new
      setCertificates((prev) => [...prev, { ...formData, id: uuidv4() }]);
    }
  };

  const handleSaveTraining = (formData: Omit<TrainingHistory, "id">) => {
    if (selectedTraining) {
      // Edit existing
      setTrainingHistory((prev) =>
        prev.map((train) =>
          train.id === selectedTraining.id
            ? { ...formData, id: train.id }
            : train
        )
      );
    } else {
      // Add new
      setTrainingHistory((prev) => [...prev, { ...formData, id: uuidv4() }]);
    }
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      // We have two options, uncomment the one you prefer
      // Option 1: Using jsPDF with autoTable
      await generatePDF(printRef.current);

      // Option 2: Using pdfmake
      // await generatePDFWithPdfMake(printRef.current);
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
