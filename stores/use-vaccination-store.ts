import { create } from "zustand";
import type { Vaccination } from "@/types";
import { mockVaccinations } from "@/schemas/mock-data";

interface VaccinationState {
  vaccinations: Vaccination[];
  selectedVaccination: Vaccination | null;
  isLoading: boolean;
  error: string | null;
  setVaccinations: (vaccinations: Vaccination[]) => void;
  addVaccination: (vaccination: Vaccination) => void;
  updateVaccination: (id: string, data: Partial<Vaccination>) => void;
  deleteVaccination: (id: string) => void;
  selectVaccination: (vaccination: Vaccination | null) => void;
}

export const useVaccinationStore = create<VaccinationState>((set) => ({
  vaccinations: mockVaccinations,
  selectedVaccination: null,
  isLoading: false,
  error: null,
  setVaccinations: (vaccinations) => set({ vaccinations }),
  addVaccination: (vaccination) =>
    set((state) => ({ vaccinations: [...state.vaccinations, vaccination] })),
  updateVaccination: (id, data) =>
    set((state) => ({
      vaccinations: state.vaccinations.map((vacc) =>
        vacc.id === id ? { ...vacc, ...data } : vacc
      ),
    })),
  deleteVaccination: (id) =>
    set((state) => ({
      vaccinations: state.vaccinations.filter((vacc) => vacc.id !== id),
    })),
  selectVaccination: (vaccination) => set({ selectedVaccination: vaccination }),
}));
