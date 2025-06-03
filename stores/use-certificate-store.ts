import { create } from "zustand";
import type { Certificate } from "@/types";
import { mockCertificates } from "@/schemas/mock-data";

interface CertificateState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  isLoading: boolean;
  error: string | null;
  setCertificates: (certificates: Certificate[]) => void;
  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (id: string, data: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  selectCertificate: (certificate: Certificate | null) => void;
}

export const useCertificateStore = create<CertificateState>((set) => ({
  certificates: mockCertificates,
  selectedCertificate: null,
  isLoading: false,
  error: null,
  setCertificates: (certificates) => set({ certificates }),
  addCertificate: (certificate) =>
    set((state) => ({ certificates: [...state.certificates, certificate] })),
  updateCertificate: (id, data) =>
    set((state) => ({
      certificates: state.certificates.map((cert) =>
        cert.id === id ? { ...cert, ...data } : cert
      ),
    })),
  deleteCertificate: (id) =>
    set((state) => ({
      certificates: state.certificates.filter((cert) => cert.id !== id),
    })),
  selectCertificate: (certificate) => set({ selectedCertificate: certificate }),
}));
