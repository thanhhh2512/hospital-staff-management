import { create } from "zustand";
import type { Vaccination } from "@/types";
import { api, type ApiResponse, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";

interface VaccinationFilters {
  search?: string;
  employeeId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface VaccinationFormData {
  employeeId: string;
  name: string;
  date: string;
  location: string;
  batchNumber?: string;
  nextDose?: string;
  notes?: string;
  vaccination?: File;
}

interface VaccinationState {
  vaccinations: Vaccination[];
  selectedVaccination: Vaccination | null;
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

  fetchVaccinations: (filters?: VaccinationFilters) => Promise<void>;
  fetchVaccination: (id: string) => Promise<void>;
  createVaccination: (data: VaccinationFormData) => Promise<boolean>;
  updateVaccination: (id: string, data: Partial<VaccinationFormData>) => Promise<boolean>;
  deleteVaccination: (id: string) => Promise<boolean>;
  selectVaccination: (vaccination: Vaccination | null) => void;
  clearError: () => void;
  setVaccinations: (vaccinations: Vaccination[]) => void;
  addVaccination: (vaccination: Vaccination) => void;
}

export const useVaccinationStore = create<VaccinationState>((set, get) => ({
  vaccinations: [],
  selectedVaccination: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchVaccinations: async (filters?: VaccinationFilters): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.employeeId) params.employeeId = filters.employeeId;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.sortBy) params.sortBy = filters.sortBy;
      if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      const response: PaginatedResponse<any> = await api.get("/vaccinations", params);

      if (response.success) {
        const mappedVaccinations = response.data.map((vacc: any) => ({
          id: vacc.id,
          name: vacc.name,
          date: vacc.date,
          location: vacc.location,
          notes: vacc.notes || "",
          file: vacc.certificateUrl || null,
          nextDose: vacc.nextDose
        }));

        set({
          vaccinations: mappedVaccinations,
          pagination: response.pagination,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch vaccinations",
      });
    }
  },

  fetchVaccination: async (id: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse<any> = await api.get(`/vaccinations/${id}`);

      if (response.success && response.data) {
        const vaccination = {
          id: response.data.id,
          name: response.data.name,
          date: response.data.date,
          location: response.data.location,
          notes: response.data.notes || "",
          file: response.data.certificateUrl || null,
          nextDose: response.data.nextDose
        };

        set({
          selectedVaccination: vaccination,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch vaccination",
      });
    }
  },

  createVaccination: async (data: VaccinationFormData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("employeeId", data.employeeId);
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("location", data.location);
      if (data.batchNumber) formData.append("batchNumber", data.batchNumber);
      if (data.nextDose) formData.append("nextDose", data.nextDose);
      if (data.notes) formData.append("notes", data.notes);
      if (data.vaccination) formData.append("vaccination", data.vaccination);

      const response: ApiResponse<any> = await api.postFormData("/vaccinations", formData);

      if (response.success && response.data) {
        const newVaccination = {
          id: response.data.id,
          name: response.data.name,
          date: response.data.date,
          location: response.data.location,
          notes: response.data.notes || "",
          file: response.data.certificateUrl || null,
          nextDose: response.data.nextDose
        };

        set((state) => ({
          vaccinations: [...state.vaccinations, newVaccination],
          isLoading: false,
          error: null,
        }));

        toast.success("Vaccination record created successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create vaccination record",
      });
      return false;
    }
  },

  updateVaccination: async (id: string, data: Partial<VaccinationFormData>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      if (data.employeeId) formData.append("employeeId", data.employeeId);
      if (data.name) formData.append("name", data.name);
      if (data.date) formData.append("date", data.date);
      if (data.location) formData.append("location", data.location);
      if (data.batchNumber) formData.append("batchNumber", data.batchNumber);
      if (data.nextDose) formData.append("nextDose", data.nextDose);
      if (data.notes) formData.append("notes", data.notes);
      if (data.vaccination) formData.append("vaccination", data.vaccination);

      const response: ApiResponse<any> = await api.putFormData(`/vaccinations/${id}`, formData);

      if (response.success && response.data) {
        const updatedVaccination = {
          id: response.data.id,
          name: response.data.name,
          date: response.data.date,
          location: response.data.location,
          notes: response.data.notes || "",
          file: response.data.certificateUrl || null,
          nextDose: response.data.nextDose
        };

        set((state) => ({
          vaccinations: state.vaccinations.map((vacc) =>
            vacc.id === id ? updatedVaccination : vacc
          ),
          selectedVaccination: state.selectedVaccination?.id === id ? updatedVaccination : state.selectedVaccination,
          isLoading: false,
          error: null,
        }));

        toast.success("Vaccination record updated successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to update vaccination record",
      });
      return false;
    }
  },

  deleteVaccination: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse = await api.delete(`/vaccinations/${id}`);

      if (response.success) {
        set((state) => ({
          vaccinations: state.vaccinations.filter((vacc) => vacc.id !== id),
          selectedVaccination: state.selectedVaccination?.id === id ? null : state.selectedVaccination,
          isLoading: false,
          error: null,
        }));

        toast.success("Vaccination record deleted successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to delete vaccination record",
      });
      return false;
    }
  },

  selectVaccination: (vaccination) => set({ selectedVaccination: vaccination }),
  clearError: () => set({ error: null }),
  setVaccinations: (vaccinations) => set({ vaccinations }),
  addVaccination: (vaccination) =>
    set((state) => ({ vaccinations: [...state.vaccinations, vaccination] })),
}));
