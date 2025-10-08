"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import type { Profile } from "@/types";

interface ProfileFormContextType {
  formData: Partial<Profile>;
  updateFormData: (updates: Partial<Profile>) => void;
  resetFormData: (profile?: Profile | null) => void;
  hasChanges: boolean;
  getPreviewData: () => Profile | null;
}

const ProfileFormContext = createContext<ProfileFormContextType | undefined>(
  undefined
);

interface ProfileFormProviderProps {
  children: ReactNode;
  initialProfile?: Profile | null;
}

export function ProfileFormProvider({
  children,
  initialProfile,
}: ProfileFormProviderProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [baseProfile, setBaseProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (
      initialProfile &&
      (!baseProfile ||
        JSON.stringify(initialProfile) !== JSON.stringify(baseProfile))
    ) {
      setBaseProfile(initialProfile);
      if (Object.keys(formData).length === 0) {
        setFormData({});
      }
    }
  }, [initialProfile, baseProfile, formData]);

  const updateFormData = useCallback((updates: Partial<Profile>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFormData = useCallback((profile?: Profile | null) => {
    if (profile) {
      setBaseProfile(profile);
      setFormData({});
    } else {
      setFormData({});
    }
  }, []);

  const hasChanges = useMemo(() => {
    return Object.keys(formData).length > 0;
  }, [formData]);

  const getPreviewData = useCallback((): Profile | null => {
    if (!baseProfile) return null;

    return {
      ...baseProfile,
      ...formData,
    } as Profile;
  }, [baseProfile, formData]);

  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      resetFormData,
      hasChanges,
      getPreviewData,
    }),
    [formData, updateFormData, resetFormData, hasChanges, getPreviewData]
  );

  return (
    <ProfileFormContext.Provider value={contextValue}>
      {children}
    </ProfileFormContext.Provider>
  );
}

export function useProfileForm() {
  const context = useContext(ProfileFormContext);
  if (context === undefined) {
    throw new Error("useProfileForm must be used within a ProfileFormProvider");
  }
  return context;
}
