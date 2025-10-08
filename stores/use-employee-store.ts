import { create } from "zustand";
import type { Employee } from "@/types";
import { api, type ApiResponse, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";

interface EmployeeFilters {
  search?: string;
  department?: string;
  position?: string;
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  departmentStats: Record<string, number>;
  positionStats: Record<string, number>;
}

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
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
  stats: EmployeeStats | null;

  fetchEmployees: (filters?: EmployeeFilters) => Promise<void>;
  fetchEmployee: (id: string) => Promise<void>;
  createEmployee: (data: Omit<Employee, "id">) => Promise<boolean>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  fetchStats: () => Promise<void>;
  selectEmployee: (employee: Employee | null) => void;
  clearError: () => void;
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  pagination: null,
  stats: null,

  fetchEmployees: async (filters?: EmployeeFilters): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.department) params.department = filters.department;
      if (filters?.position) params.position = filters.position;
      if (filters?.status) params.status = filters.status;
      if (filters?.sortBy) params.sortBy = filters.sortBy;
      if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      const response: PaginatedResponse<Employee> = await api.get("/employees", params);

      if (response.success) {
        const mappedEmployees = response.data.map((emp: any) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          position: emp.position,
          hireDate: emp.hireDate,
          status: emp.status?.toLowerCase() as "active" | "inactive" | "onleave" || "active"
        }));

        set({
          employees: mappedEmployees,
          pagination: response.pagination,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch employees",
      });
    }
  },

  fetchEmployee: async (id: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse<Employee> = await api.get(`/employees/${id}`);

      if (response.success && response.data) {
        const employee = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          department: response.data.department,
          position: response.data.position,
          hireDate: response.data.hireDate,
          status: response.data.status?.toLowerCase() as "active" | "inactive" | "onleave" || "active"
        };

        set({
          selectedEmployee: employee,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to fetch employee",
      });
    }
  },

  createEmployee: async (data: Omit<Employee, "id">): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        position: data.position,
        hireDate: data.hireDate,
        status: data.status?.toUpperCase() || "ACTIVE"
      };

      const response: ApiResponse<Employee> = await api.post("/employees", payload);

      if (response.success && response.data) {
        const newEmployee = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          department: response.data.department,
          position: response.data.position,
          hireDate: response.data.hireDate,
          status: response.data.status?.toLowerCase() as "active" | "inactive" | "onleave" || "active"
        };

        set((state) => ({
          employees: [...state.employees, newEmployee],
          isLoading: false,
          error: null,
        }));

        toast.success("Employee created successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to create employee",
      });
      return false;
    }
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const payload: Record<string, any> = {};
      if (data.name) payload.name = data.name;
      if (data.email) payload.email = data.email;
      if (data.phone) payload.phone = data.phone;
      if (data.department) payload.department = data.department;
      if (data.position) payload.position = data.position;
      if (data.hireDate) payload.hireDate = data.hireDate;
      if (data.status) payload.status = data.status.toUpperCase();

      const response: ApiResponse<Employee> = await api.put(`/employees/${id}`, payload);

      if (response.success && response.data) {
        const updatedEmployee = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          department: response.data.department,
          position: response.data.position,
          hireDate: response.data.hireDate,
          status: response.data.status?.toLowerCase() as "active" | "inactive" | "onleave" || "active"
        };

        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? updatedEmployee : emp
          ),
          selectedEmployee: state.selectedEmployee?.id === id ? updatedEmployee : state.selectedEmployee,
          isLoading: false,
          error: null,
        }));

        toast.success("Employee updated successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to update employee",
      });
      return false;
    }
  },

  deleteEmployee: async (id: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse = await api.delete(`/employees/${id}`);

      if (response.success) {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
          selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
          isLoading: false,
          error: null,
        }));

        toast.success("Employee deleted successfully");
        return true;
      }

      return false;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || "Failed to delete employee",
      });
      return false;
    }
  },

  fetchStats: async (): Promise<void> => {
    try {
      const response: ApiResponse<EmployeeStats> = await api.get("/employees/stats");

      if (response.success && response.data) {
        set({ stats: response.data });
      }
    } catch (error: any) {
      console.error("Failed to fetch employee stats:", error);
    }
  },

  selectEmployee: (employee) => set({ selectedEmployee: employee }),
  clearError: () => set({ error: null }),

  // Legacy methods (preserved for compatibility)
  setEmployees: (employees) => set({ employees }),
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),
}));
