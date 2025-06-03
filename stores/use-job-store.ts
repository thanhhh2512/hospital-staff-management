import { create } from "zustand";
import type { JobAssignment, JobDescription } from "@/types";
import { mockJobAssignments, mockJobDescriptions } from "@/schemas/mock-data";

interface JobState {
  assignments: JobAssignment[];
  descriptions: JobDescription[];
  selectedAssignment: JobAssignment | null;
  selectedDescription: JobDescription | null;
  isLoading: boolean;
  error: string | null;

  // Job Assignments
  setAssignments: (assignments: JobAssignment[]) => void;
  addAssignment: (assignment: JobAssignment) => void;
  updateAssignment: (id: string, data: Partial<JobAssignment>) => void;
  deleteAssignment: (id: string) => void;
  selectAssignment: (assignment: JobAssignment | null) => void;

  // Job Descriptions
  setDescriptions: (descriptions: JobDescription[]) => void;
  addDescription: (description: JobDescription) => void;
  updateDescription: (id: string, data: Partial<JobDescription>) => void;
  deleteDescription: (id: string) => void;
  selectDescription: (description: JobDescription | null) => void;
}

export const useJobStore = create<JobState>((set) => ({
  assignments: mockJobAssignments,
  descriptions: mockJobDescriptions,
  selectedAssignment: null,
  selectedDescription: null,
  isLoading: false,
  error: null,

  // Job Assignments
  setAssignments: (assignments) => set({ assignments }),
  addAssignment: (assignment) =>
    set((state) => ({ assignments: [...state.assignments, assignment] })),
  updateAssignment: (id, data) =>
    set((state) => ({
      assignments: state.assignments.map((assign) =>
        assign.id === id ? { ...assign, ...data } : assign
      ),
    })),
  deleteAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((assign) => assign.id !== id),
    })),
  selectAssignment: (assignment) => set({ selectedAssignment: assignment }),

  // Job Descriptions
  setDescriptions: (descriptions) => set({ descriptions }),
  addDescription: (description) =>
    set((state) => ({ descriptions: [...state.descriptions, description] })),
  updateDescription: (id, data) =>
    set((state) => ({
      descriptions: state.descriptions.map((desc) =>
        desc.id === id ? { ...desc, ...data } : desc
      ),
    })),
  deleteDescription: (id) =>
    set((state) => ({
      descriptions: state.descriptions.filter((desc) => desc.id !== id),
    })),
  selectDescription: (description) => set({ selectedDescription: description }),
}));
