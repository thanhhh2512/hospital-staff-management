import { create } from "zustand";
import type { Profile } from "@/types";
import { mockProfile } from "@/schemas/mock-data";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (data: Partial<Profile>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: mockProfile,
  isLoading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (data) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),
  resetProfile: () => set({ profile: null, error: null }),
}));
