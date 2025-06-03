import { create } from "zustand";
import type { TrainingHistory } from "@/types";
import { mockTrainingHistory } from "@/schemas/mock-data";

interface TrainingState {
  trainings: TrainingHistory[];
  selectedTraining: TrainingHistory | null;
  isLoading: boolean;
  error: string | null;
  setTrainings: (trainings: TrainingHistory[]) => void;
  addTraining: (training: TrainingHistory) => void;
  updateTraining: (id: string, data: Partial<TrainingHistory>) => void;
  deleteTraining: (id: string) => void;
  selectTraining: (training: TrainingHistory | null) => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  trainings: mockTrainingHistory,
  selectedTraining: null,
  isLoading: false,
  error: null,
  setTrainings: (trainings) => set({ trainings }),
  addTraining: (training) =>
    set((state) => ({ trainings: [...state.trainings, training] })),
  updateTraining: (id, data) =>
    set((state) => ({
      trainings: state.trainings.map((train) =>
        train.id === id ? { ...train, ...data } : train
      ),
    })),
  deleteTraining: (id) =>
    set((state) => ({
      trainings: state.trainings.filter((train) => train.id !== id),
    })),
  selectTraining: (training) => set({ selectedTraining: training }),
}));
