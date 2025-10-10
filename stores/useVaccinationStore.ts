import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Vaccination, VaccinationCertificate } from "@/types";

interface VaccinationState {
  vaccinations: Vaccination[];
  certificates: VaccinationCertificate[];
  isLoading: boolean;
  error: string | null;
  addVaccination: (vaccination: Omit<Vaccination, "id">) => void;
  updateVaccination: (id: string, vaccination: Partial<Vaccination>) => void;
  deleteVaccination: (id: string) => void;
  addCertificate: (certificate: Omit<VaccinationCertificate, "id">) => void;
  updateCertificate: (
    id: string,
    certificate: Partial<VaccinationCertificate>
  ) => void;
  deleteCertificate: (id: string) => void;
}

// Mock data
const mockVaccinations: Vaccination[] = [
  {
    id: "1",
    employeeId: "emp-001",
    name: "Vắc-xin COVID-19 (Pfizer)",
    date: "2021-08-15",
    location: "Trung tâm Y tế Quận Ninh Kiều",
    notes: "Mũi 1",
    fileUrl: null,
    nextDose: "2021-09-05",
  },
  {
    id: "2",
    employeeId: "emp-001",
    name: "Vắc-xin COVID-19 (Pfizer)",
    date: "2021-09-05",
    location: "Trung tâm Y tế Quận Ninh Kiều",
    notes: "Mũi 2",
    fileUrl: null,
  },
];

const mockCertificates: VaccinationCertificate[] = [
  {
    id: "1",
    name: "Chứng nhận tiêm chủng COVID-19",
    issueDate: "2021-09-15",
    issuer: "Sở Y tế Thành phố Cần Thơ",
    fileUrl: null,
  },
  {
    id: "2",
    name: "Chứng nhận tiêm phòng Viêm gan B",
    issueDate: "2020-03-10",
    expiryDate: "2030-03-10",
    issuer: "Bệnh viện Đa khoa Thành phố Cần Thơ",
    fileUrl: null,
  },
];

export const useVaccinationStore = create<VaccinationState>((set) => ({
  vaccinations: mockVaccinations,
  certificates: mockCertificates,
  isLoading: false,
  error: null,

  addVaccination: (vaccination) =>
    set((state) => ({
      vaccinations: [...state.vaccinations, { ...vaccination, id: uuidv4() }],
    })),

  updateVaccination: (id, vaccination) =>
    set((state) => ({
      vaccinations: state.vaccinations.map((vac) =>
        vac.id === id ? { ...vac, ...vaccination } : vac
      ),
    })),

  deleteVaccination: (id) =>
    set((state) => ({
      vaccinations: state.vaccinations.filter((vac) => vac.id !== id),
    })),

  addCertificate: (certificate) =>
    set((state) => ({
      certificates: [...state.certificates, { ...certificate, id: uuidv4() }],
    })),

  updateCertificate: (id, certificate) =>
    set((state) => ({
      certificates: state.certificates.map((cert) =>
        cert.id === id ? { ...cert, ...certificate } : cert
      ),
    })),

  deleteCertificate: (id) =>
    set((state) => ({
      certificates: state.certificates.filter((cert) => cert.id !== id),
    })),
}));
