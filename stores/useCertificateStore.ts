import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Certificate, TrainingHistory } from "@/types";

interface CertificateState {
  certificates: Certificate[];
  trainingHistory: TrainingHistory[];
  isLoading: boolean;
  error: string | null;
  addCertificate: (certificate: Omit<Certificate, "id">) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  addTraining: (training: Omit<TrainingHistory, "id">) => void;
  updateTraining: (id: string, training: Partial<TrainingHistory>) => void;
  deleteTraining: (id: string) => void;
}

// Mock data
const mockCertificates: Certificate[] = [
  {
    id: "1",
    name: "Bằng Cử nhân Xét nghiệm",
    type: "DEGREE",
    issueDate: "2012-10-30",
    issuer: "Trường ĐHYD.TP Hồ Chí Minh",
    description: "Tốt nghiệp loại Khá",
    fileUrl: null,
    status: "ACTIVE",
    employeeName: "Test Employee",
    employeeId: "EMP001",
  },
  {
    id: "2",
    name: "Chứng chỉ hành nghề Xét nghiệm",
    type: "CERTIFICATE",
    issueDate: "2013-05-15",
    issuer: "Bộ Y tế",
    description: "Chứng chỉ hành nghề cho kỹ thuật viên xét nghiệm",
    fileUrl: null,
    status: "ACTIVE",
    employeeName: "Test Employee",
    employeeId: "EMP001",
  },
];

const mockTrainingHistory: TrainingHistory[] = [
  {
    id: "1",
    employeeId: "emp1",
    school: "Trường ĐHYD.TP Hồ Chí Minh",
    major: "Xét nghiệm",
    startDate: "11/2009",
    endDate: "10/2012",
    type: "DEGREE",
    degree: "Cử nhân",
  },
];

export const useCertificateStore = create<CertificateState>((set) => ({
  certificates: mockCertificates,
  trainingHistory: mockTrainingHistory,
  isLoading: false,
  error: null,

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

  addTraining: (training) =>
    set((state) => ({
      trainingHistory: [
        ...state.trainingHistory,
        { ...training, id: uuidv4() },
      ],
    })),

  updateTraining: (id, training) =>
    set((state) => ({
      trainingHistory: state.trainingHistory.map((train) =>
        train.id === id ? { ...train, ...training } : train
      ),
    })),

  deleteTraining: (id) =>
    set((state) => ({
      trainingHistory: state.trainingHistory.filter((train) => train.id !== id),
    })),
}));
