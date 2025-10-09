import { useMemo } from "react";
import {
  useProfileStore,
  useCertificateStore,
  useVaccinationStore,
  useEmployeeStore,
} from "@/stores";
import type { DocumentView, Profile, Certificate, Vaccination } from "@/types";

export const useDocumentsView = () => {
  const { profile } = useProfileStore() || {};
  const { certificates = [] } = useCertificateStore() || {};
  const { vaccinations = [] } = useVaccinationStore() || {};
  const { employees = [] } = useEmployeeStore() || {};

  const documents = useMemo<DocumentView[]>(() => {
    const docs: DocumentView[] = [];

    // Map profile to document if it exists
    if (profile) {
      const employee = employees.find((emp) => emp.id === profile.idNumber);
      if (employee) {
        docs.push({
          id: `profile-${profile.idNumber}`,
          title: `Lý lịch - ${employee.name}`,
          category: "personal",
          employeeName: employee.name,
          employeeId: employee.id,
          uploadDate: profile.idIssueDate,
          status: "active",
          description: `Lý lịch cá nhân của ${employee.name}`,
          file: profile.avatar || null,
          sourceType: "profile",
          sourceId: profile.idNumber,
        });
      }
    }

    // Map certificates to documents
    if (certificates?.length > 0) {
      certificates.forEach((cert: Certificate) => {
        const employee = employees.find((emp) => emp.id === cert.employeeId);
        if (employee) {
          docs.push({
            id: `cert-${cert.id}`,
            title: cert.name,
            category: cert.type === "DEGREE" ? "degree" : "certificate",
            employeeName: employee.name,
            employeeId: employee.id,
            uploadDate: cert.issueDate,
            status:
              cert.status === "EXPIRED" ? "archived" as const : cert.status === "ACTIVE" ? "active" as const : "pending" as const,
            description: cert.description,
            file: cert.fileUrl,
            sourceType: "certificate",
            sourceId: cert.id,
          });
        }
      });
    }

    // Map vaccinations to documents
    if (vaccinations?.length > 0) {
      vaccinations.forEach((vacc: Vaccination) => {
        // Giả sử vaccination có liên kết với employee qua một trường nào đó
        // Ví dụ: vacc.employeeId hoặc từ một store mapping khác
        const employee = employees[0]; // Tạm thời gán cho employee đầu tiên
        if (employee) {
          docs.push({
            id: `vacc-${vacc.id}`,
            title: `Tiêm chủng - ${vacc.name}`,
            category: "vaccination",
            employeeName: employee.name,
            employeeId: employee.id,
            uploadDate: vacc.date,
            status: "active",
            description: vacc.notes,
            file: vacc.fileUrl,
            sourceType: "vaccination",
            sourceId: vacc.id,
          });
        }
      });
    }

    return docs;
  }, [profile, certificates, vaccinations, employees]);

  const filterDocuments = (category: string) => {
    if (category === "all") return documents;
    return documents.filter((doc) => doc.category === category);
  };

  return {
    documents,
    filterDocuments,
  };
};
