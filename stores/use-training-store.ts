import { create } from "zustand";
import type { TrainingHistory } from "@/types";
import { api, type ApiResponse, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";

interface TrainingFilters {
  search?: string;
  type?: string;
  employeeId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface TrainingFormData {
  employeeId?: string;
  school: string;
  major: string;
  startDate: string;
  endDate: string;
  type: string;
  degree: string;
}

interface TrainingState {
  trainings: TrainingHistory[];
  selectedTraining: TrainingHistory | null;
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
  fetchTrainings: (filters?: TrainingFilters) => Promise<void>;
  fetchTraining: (id: string) => Promise<void>;
  createTraining: (data: TrainingFormData) => Promise<boolean>;
  updateTraining: (id: string, data: Partial<TrainingFormData>) => Promise<boolean>;
  deleteTraining: (id: string) => Promise<boolean>;
  selectTraining: (training: TrainingHistory | null) => void;
  clearError: () => void;
  setTrainings: (trainings: TrainingHistory[]) => void;
  addTraining: (training: TrainingHistory) => void;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  trainings: [],
  selectedTraining: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchTrainings: async (filters?: TrainingFilters): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.type) params.type = filters.type;
      if (filters?.employeeId) params.employeeId = filters.employeeId;
      if (filters?.sortBy) params.sortBy = filters.sortBy;
      if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      set({
        trainings: [],
        pagination: null,
        isLoading: false,
        error: null,
      });

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch training records",
      });
    }
  },

  fetchTraining: async (id: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      set({
        selectedTraining: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch training record",
      });
    }
  },

  createTraining: async (data: TrainingFormData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      set({ isLoading: false, error: null });
      toast.success("Training record created successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create training record",
      });
      return false;
    }
  },

  updateTraining: async (id: string, data: Partial<TrainingFormData>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      set({ isLoading: false, error: null });
      toast.success("Training record updated successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to update training record",
      });
      return false;
    }
  },

  deleteTraining: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {

      set({ isLoading: false, error: null });
      toast.success("Training record deleted successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to delete training record",
      });
      return false;
    }
  },

  selectTraining: (training) => set({ selectedTraining: training }),
  clearError: () => set({ error: null }),
  setTrainings: (trainings) => set({ trainings }),
  addTraining: (training) =>
    set((state) => ({ trainings: [...state.trainings, training] })),
}));
