import { create } from "zustand";
import type { TrainingHistory } from "@/types";
import { api, type ApiResponse, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";

interface TrainingFilters {
  search?: string;
  type?: "DEGREE" | "CERTIFICATE" | "COURSE" | "OTHER";
  employeeId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface TrainingFormData {
  employeeId: string;
  school: string;
  major: string;
  startDate: string;
  endDate?: string;
  type: "DEGREE" | "CERTIFICATE" | "COURSE" | "OTHER";
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
  fetchTrainingsByEmployeeId: (employeeId: string, params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => Promise<void>;
  fetchTraining: (id: string) => Promise<void>;
  createTraining: (data: Omit<TrainingHistory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateTraining: (id: string, data: Partial<TrainingHistory>) => Promise<boolean>;
  deleteTraining: (id: string) => Promise<boolean>;
  selectTraining: (training: TrainingHistory | null) => void;
  clearError: () => void;

  // Legacy methods for backward compatibility
  fetchTrainings: (filters?: TrainingFilters) => Promise<void>;
  setTrainings: (trainings: TrainingHistory[]) => void;
  addTraining: (training: TrainingHistory) => void;
}

// Helper function to map backend data to frontend format
const mapTrainingFromApi = (apiData: any): TrainingHistory => ({
  id: apiData._id,
  employeeId: apiData.employeeId,
  school: apiData.school,
  major: apiData.major,
  startDate: apiData.startDate.split('T')[0], // Convert to YYYY-MM-DD
  endDate: apiData.endDate ? apiData.endDate.split('T')[0] : undefined, // Convert to YYYY-MM-DD
  type: apiData.type as "DEGREE" | "CERTIFICATE" | "COURSE" | "OTHER",
  degree: apiData.degree,
  createdAt: apiData.createdAt,
  updatedAt: apiData.updatedAt,
});

export const useTrainingStore = create<TrainingState>((set, get) => ({
  trainings: [],
  selectedTraining: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchTrainingsByEmployeeId: async (employeeId: string, params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const queryParams: Record<string, any> = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        sortBy: params?.sortBy || 'startDate',
        sortOrder: params?.sortOrder || 'desc',
      };

      const response: PaginatedResponse<any> = await api.get(`/trainings/employee/${employeeId}`, queryParams);

      if (response.success) {
        const mappedTrainings = response.data.map(mapTrainingFromApi);

        set({
          trainings: mappedTrainings,
          pagination: response.pagination,
          isLoading: false,
          error: null,
        });
      }
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
      const response: ApiResponse<any> = await api.get(`/trainings/${id}`);

      if (response.success && response.data) {
        const training = mapTrainingFromApi(response.data);

        set({
          selectedTraining: training,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch training record",
      });
    }
  },

  createTraining: async (data: Omit<TrainingHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const payload = {
        employeeId: data.employeeId,
        school: data.school,
        major: data.major,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        degree: data.degree,
      };

      const response: ApiResponse<any> = await api.post("/trainings", payload);

      if (response.success && response.data) {
        const newId = response.data._id;

        // Immediately fetch the created record to get the canonical version
        const fetchResponse: ApiResponse<any> = await api.get(`/trainings/${newId}`);

        if (fetchResponse.success && fetchResponse.data) {
          const newTraining = mapTrainingFromApi(fetchResponse.data);

          set((state) => ({
            trainings: [...state.trainings, newTraining],
            isLoading: false,
            error: null,
          }));

          return true;
        }
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create training record",
      });
      return false;
    }
  },

  updateTraining: async (id: string, data: Partial<TrainingHistory>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const payload: any = {};
      if (data.employeeId) payload.employeeId = data.employeeId;
      if (data.school) payload.school = data.school;
      if (data.major) payload.major = data.major;
      if (data.startDate) payload.startDate = data.startDate;
      if (data.endDate !== undefined) payload.endDate = data.endDate;
      if (data.type) payload.type = data.type;
      if (data.degree) payload.degree = data.degree;

      const response: ApiResponse<any> = await api.put(`/trainings/${id}`, payload);

      if (response.success) {
        // Immediately fetch the updated record to get the canonical version
        const fetchResponse: ApiResponse<any> = await api.get(`/trainings/${id}`);

        if (fetchResponse.success && fetchResponse.data) {
          const updatedTraining = mapTrainingFromApi(fetchResponse.data);

          set((state) => ({
            trainings: state.trainings.map((training) =>
              training.id === id ? updatedTraining : training
            ),
            selectedTraining: state.selectedTraining?.id === id ? updatedTraining : state.selectedTraining,
            isLoading: false,
            error: null,
          }));

          return true;
        }
      }

      return false;
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
      const response: ApiResponse = await api.delete(`/trainings/${id}`);

      if (response.success) {
        set((state) => ({
          trainings: state.trainings.filter((training) => training.id !== id),
          selectedTraining: state.selectedTraining?.id === id ? null : state.selectedTraining,
          isLoading: false,
          error: null,
        }));

        toast.success("Training record deleted successfully");
        return true;
      }

      return false;
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

  // Legacy methods for backward compatibility
  fetchTrainings: async (filters?: TrainingFilters): Promise<void> => {
    if (filters?.employeeId) {
      return get().fetchTrainingsByEmployeeId(filters.employeeId, {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
    }

    // If no employeeId is provided, return empty results
    set({
      trainings: [],
      pagination: null,
      isLoading: false,
      error: "Employee ID is required to fetch training records",
    });
  },

  setTrainings: (trainings) => set({ trainings }),
  addTraining: (training) =>
    set((state) => ({ trainings: [...state.trainings, training] })),
}));
