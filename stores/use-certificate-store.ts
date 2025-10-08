import { create } from "zustand";
import type { Certificate } from "@/types";
import { api, type ApiResponse, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";

interface CertificateFilters {
  search?: string;
  type?: string;
  status?: "ACTIVE" | "EXPIRED" | "SUSPENDED";
  employeeId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface CertificateFormData {
  employeeId: string;
  name: string;
  type: "DEGREE" | "CERTIFICATE" | "OTHER";
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status?: "ACTIVE" | "EXPIRED" | "SUSPENDED";
  description?: string;
  certificate?: File;
}

interface CertificateState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  // Actions
  fetchCertificates: (filters?: CertificateFilters) => Promise<void>;
  fetchCertificate: (id: string) => Promise<void>;
  createCertificate: (data: CertificateFormData) => Promise<boolean>;
  updateCertificate: (id: string, data: Partial<CertificateFormData>) => Promise<boolean>;
  deleteCertificate: (id: string) => Promise<boolean>;
  fetchExpiringCertificates: (days?: number) => Promise<void>;
  selectCertificate: (certificate: Certificate | null) => void;
  clearError: () => void;
  setCertificates: (certificates: Certificate[]) => void;
  addCertificate: (certificate: Certificate) => void;
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
  certificates: [],
  selectedCertificate: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchCertificates: async (filters?: CertificateFilters): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.type) params.type = filters.type;
      if (filters?.status) params.status = filters.status;
      if (filters?.employeeId) params.employeeId = filters.employeeId;
      if (filters?.sortBy) params.sortBy = filters.sortBy;
      if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      const response: PaginatedResponse<any> = await api.get("/certificates", params);

      if (response.success) {
        const mappedCertificates = response.data.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          type: cert.type?.toLowerCase() as "degree" | "certificate" | "other" || "certificate",
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate,
          description: cert.description || "",
          file: cert.certificateUrl || null,
          employeeId: cert.employeeId,
          employeeName: cert.employeeName || "",
          status: cert.status?.toLowerCase() as "active" | "expired" | "pending" || "active"
        }));

        set({
          certificates: mappedCertificates,
          pagination: response.pagination,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch certificates",
      });
    }
  },

  fetchCertificate: async (id: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse<any> = await api.get(`/certificates/${id}`);

      if (response.success && response.data) {
        const certificate = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type?.toLowerCase() as "degree" | "certificate" | "other" || "certificate",
          issuer: response.data.issuer,
          issueDate: response.data.issueDate,
          expiryDate: response.data.expiryDate,
          description: response.data.description || "",
          file: response.data.certificateUrl || null,
          employeeId: response.data.employeeId,
          employeeName: response.data.employeeName || "",
          status: response.data.status?.toLowerCase() as "active" | "expired" | "pending" || "active"
        };

        set({
          selectedCertificate: certificate,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch certificate",
      });
    }
  },

  createCertificate: async (data: CertificateFormData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("employeeId", data.employeeId);
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("issuer", data.issuer);
      formData.append("issueDate", data.issueDate);
      if (data.expiryDate) formData.append("expiryDate", data.expiryDate);
      if (data.status) formData.append("status", data.status);
      if (data.description) formData.append("description", data.description);
      if (data.certificate) formData.append("certificate", data.certificate);

      const response: ApiResponse<any> = await api.postFormData("/certificates", formData);

      if (response.success && response.data) {
        const newCertificate = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type?.toLowerCase() as "degree" | "certificate" | "other" || "certificate",
          issuer: response.data.issuer,
          issueDate: response.data.issueDate,
          expiryDate: response.data.expiryDate,
          description: response.data.description || "",
          file: response.data.certificateUrl || null,
          employeeId: response.data.employeeId,
          employeeName: "",
          status: response.data.status?.toLowerCase() as "active" | "expired" | "pending" || "active"
        };

        set((state) => ({
          certificates: [...state.certificates, newCertificate],
          isLoading: false,
          error: null,
        }));

        toast.success("Certificate created successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create certificate",
      });
      return false;
    }
  },

  updateCertificate: async (id: string, data: Partial<CertificateFormData>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      if (data.employeeId) formData.append("employeeId", data.employeeId);
      if (data.name) formData.append("name", data.name);
      if (data.type) formData.append("type", data.type);
      if (data.issuer) formData.append("issuer", data.issuer);
      if (data.issueDate) formData.append("issueDate", data.issueDate);
      if (data.expiryDate) formData.append("expiryDate", data.expiryDate);
      if (data.status) formData.append("status", data.status);
      if (data.description) formData.append("description", data.description);
      if (data.certificate) formData.append("certificate", data.certificate);

      const response: ApiResponse<any> = await api.putFormData(`/certificates/${id}`, formData);

      if (response.success && response.data) {
        const updatedCertificate = {
          id: response.data.id,
          name: response.data.name,
          type: response.data.type?.toLowerCase() as "degree" | "certificate" | "other" || "certificate",
          issuer: response.data.issuer,
          issueDate: response.data.issueDate,
          expiryDate: response.data.expiryDate,
          description: response.data.description || "",
          file: response.data.certificateUrl || null,
          employeeId: response.data.employeeId,
          employeeName: "",
          status: response.data.status?.toLowerCase() as "active" | "expired" | "pending" || "active"
        };

        set((state) => ({
          certificates: state.certificates.map((cert) =>
            cert.id === id ? updatedCertificate : cert
          ),
          selectedCertificate: state.selectedCertificate?.id === id ? updatedCertificate : state.selectedCertificate,
          isLoading: false,
          error: null,
        }));

        toast.success("Certificate updated successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to update certificate",
      });
      return false;
    }
  },

  deleteCertificate: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse = await api.delete(`/certificates/${id}`);

      if (response.success) {
        set((state) => ({
          certificates: state.certificates.filter((cert) => cert.id !== id),
          selectedCertificate: state.selectedCertificate?.id === id ? null : state.selectedCertificate,
          isLoading: false,
          error: null,
        }));

        toast.success("Certificate deleted successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to delete certificate",
      });
      return false;
    }
  },

  fetchExpiringCertificates: async (days: number = 30): Promise<void> => {
    try {
      const response: PaginatedResponse<any> = await api.get("/certificates/expiring", { days });

      if (response.success) {
        const mappedCertificates = response.data.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          type: cert.type?.toLowerCase() as "degree" | "certificate" | "other" || "certificate",
          issuer: cert.issuer || "",
          issueDate: cert.issueDate || "",
          expiryDate: cert.expiryDate,
          description: cert.description || "",
          file: cert.certificateUrl || null,
          employeeId: cert.employeeId,
          employeeName: cert.employeeName || "",
          status: "expired" as "active" | "expired" | "pending"
        }));

        set({ certificates: mappedCertificates });
      }
    } catch (error: any) {
      console.error("Failed to fetch expiring certificates:", error);
    }
  },

  selectCertificate: (certificate) => set({ selectedCertificate: certificate }),
  clearError: () => set({ error: null }),
  setCertificates: (certificates) => set({ certificates }),
  addCertificate: (certificate) =>
    set((state) => ({ certificates: [...state.certificates, certificate] })),
}));
