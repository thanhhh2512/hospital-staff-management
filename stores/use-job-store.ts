import { create } from "zustand";
import type { JobAssignment, JobDescription } from "@/types";
import { api, type ApiResponse, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";

interface JobFilters {
  search?: string;
  department?: string;
  status?: string;
  employeeId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface JobAssignmentFormData {
  title: string;
  employeeId: string;
  department: string;
  assignDate: string;
  dueDate: string;
  status: "active" | "completed" | "overdue";
  description: string;
  file?: string | File | null;
}

interface JobDescriptionFormData {
  title: string;
  department: string;
  status: "active" | "inactive";
  content: string;
}

interface JobState {
  assignments: JobAssignment[];
  descriptions: JobDescription[];
  selectedAssignment: JobAssignment | null;
  selectedDescription: JobDescription | null;
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

  fetchAssignments: (filters?: JobFilters) => Promise<void>;
  fetchAssignment: (id: string) => Promise<void>;
  createAssignment: (data: JobAssignmentFormData) => Promise<boolean>;
  updateAssignment: (id: string, data: Partial<JobAssignmentFormData>) => Promise<boolean>;
  deleteAssignment: (id: string) => Promise<boolean>;
  selectAssignment: (assignment: JobAssignment | null) => void;

  fetchDescriptions: (filters?: JobFilters) => Promise<void>;
  fetchDescription: (id: string) => Promise<void>;
  createDescription: (data: JobDescriptionFormData) => Promise<boolean>;
  updateDescription: (id: string, data: Partial<JobDescriptionFormData>) => Promise<boolean>;
  deleteDescription: (id: string) => Promise<boolean>;
  selectDescription: (description: JobDescription | null) => void;

  clearError: () => void;

  setAssignments: (assignments: JobAssignment[]) => void;
  setDescriptions: (descriptions: JobDescription[]) => void;
  addAssignment: (assignment: JobAssignment) => void;
  addDescription: (description: JobDescription) => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  assignments: [],
  descriptions: [],
  selectedAssignment: null,
  selectedDescription: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchAssignments: async (filters?: JobFilters): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.department) params.department = filters.department;
      if (filters?.status) params.status = filters.status;
      if (filters?.employeeId) params.employeeId = filters.employeeId;
      if (filters?.sortBy) params.sortBy = filters.sortBy;
      if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      set({
        assignments: [],
        pagination: null,
        isLoading: false,
        error: null,
      });

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch job assignments",
      });
    }
  },

  fetchAssignment: async (id: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      set({
        selectedAssignment: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch job assignment",
      });
    }
  },

  createAssignment: async (data: JobAssignmentFormData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("employeeId", data.employeeId);
      formData.append("department", data.department);
      formData.append("assignDate", data.assignDate);
      formData.append("dueDate", data.dueDate);
      formData.append("status", data.status);
      formData.append("description", data.description);
      if (data.file) formData.append("file", data.file);


      set({ isLoading: false, error: null });
      toast.success("Job assignment created successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create job assignment",
      });
      return false;
    }
  },

  updateAssignment: async (id: string, data: Partial<JobAssignmentFormData>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.employeeId) formData.append("employeeId", data.employeeId);
      if (data.department) formData.append("department", data.department);
      if (data.assignDate) formData.append("assignDate", data.assignDate);
      if (data.dueDate) formData.append("dueDate", data.dueDate);
      if (data.status) formData.append("status", data.status);
      if (data.description) formData.append("description", data.description);
      if (data.file) formData.append("file", data.file);

      set({ isLoading: false, error: null });
      toast.success("Job assignment updated successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to update job assignment",
      });
      return false;
    }
  },

  deleteAssignment: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
     
      set({ isLoading: false, error: null });
      toast.success("Job assignment deleted successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to delete job assignment",
      });
      return false;
    }
  },

  fetchDescriptions: async (filters?: JobFilters): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.department) params.department = filters.department;
      if (filters?.status) params.status = filters.status;
      if (filters?.sortBy) params.sortBy = filters.sortBy;
      if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      set({
        descriptions: [],
        isLoading: false,
        error: null,
      });

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch job descriptions",
      });
    }
  },

  fetchDescription: async (id: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {

      set({
        selectedDescription: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch job description",
      });
    }
  },

  createDescription: async (data: JobDescriptionFormData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {

      set({ isLoading: false, error: null });
      toast.success("Job description created successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create job description",
      });
      return false;
    }
  },

  updateDescription: async (id: string, data: Partial<JobDescriptionFormData>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
     
      set({ isLoading: false, error: null });
      toast.success("Job description updated successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to update job description",
      });
      return false;
    }
  },

  deleteDescription: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
     
      set({ isLoading: false, error: null });
      toast.success("Job description deleted successfully");
      return true;

    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to delete job description",
      });
      return false;
    }
  },

  selectAssignment: (assignment) => set({ selectedAssignment: assignment }),
  selectDescription: (description) => set({ selectedDescription: description }),
  clearError: () => set({ error: null }),
  setAssignments: (assignments) => set({ assignments }),
  setDescriptions: (descriptions) => set({ descriptions }),
  addAssignment: (assignment) =>
    set((state) => ({ assignments: [...state.assignments, assignment] })),
  addDescription: (description) =>
    set((state) => ({ descriptions: [...state.descriptions, description] })),
}));
