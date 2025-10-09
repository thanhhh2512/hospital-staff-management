import { create } from "zustand";
import type { Profile } from "@/types";
import { api, type ApiResponse } from "@/lib/api";
import { toast } from "sonner";

interface ProfileFormData extends Omit<Profile, 'avatar'> {
  avatar?: File;
}

interface ProfileState {
  profile: Profile | null;
  hasProfile: boolean;
  isLoading: boolean;
  error: string | null;

  fetchProfile: (employeeId: string) => Promise<void>;
  createProfile: (employeeId: string, data: ProfileFormData) => Promise<boolean>;
  deleteProfile: (employeeId: string) => Promise<boolean>;
  clearError: () => void;

  // Legacy methods for backward compatibility
  checkProfileExists: (employeeId: string) => Promise<boolean>;
  createProfileApi: (employeeId: string, data: ProfileFormData) => Promise<boolean>;
  setProfile: (profile: Profile) => void;
  resetProfile: () => void;
  updateProfile: (data: Partial<Profile>) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  hasProfile: false,
  isLoading: false,
  error: null,

  fetchProfile: async (employeeId: string): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const endpoint = `/profiles/${employeeId}`;
      const response: ApiResponse<any> = await api.get(endpoint, undefined, { noCache: true });

      if (response.success && response.data) {
        const profile: Profile = {
          fullName: response.data.fullName ?? "",
          gender: response.data.gender?.toLowerCase() as "male" | "female" | "other" ?? "male",
          dob: response.data.dob ? response.data.dob.split("T")[0] : "",
          birthPlace: response.data.birthPlace ?? "",
          hometown: response.data.hometown ?? "",
          ethnicity: response.data.ethnicity ?? "",
          religion: response.data.religion ?? "",
          idNumber: response.data.idNumber ?? "",
          idIssueDate: response.data.idIssueDate ? response.data.idIssueDate.split("T")[0] : "",
          phone: response.data.phone ?? "",
          email: response.data.email ?? "",
          permanentAddress: response.data.permanentAddress ?? "",
          currentAddress: response.data.currentAddress ?? "",
          avatar: response.data.avatar ?? null,

          // Professional Information
          position: response.data.position ?? "",
          department: response.data.department ?? "",
          jobTitle: response.data.jobTitle ?? "",
          hireDate: response.data.hireDate ? response.data.hireDate.split("T")[0] : "",
          hireAgency: response.data.hireAgency ?? "",
          rank: response.data.rank ?? "",
          salary: response.data.salary ?? "",
          salaryDate: response.data.salaryDate ? response.data.salaryDate.split("T")[0] : "",
          education: response.data.education ?? "",
          specialization: response.data.specialization ?? "",
          politics: response.data.politics ?? "",
          management: response.data.management ?? "",
          languageLevel: response.data.languageLevel ?? "",
          it: response.data.it ?? "",
          partyJoinDate: response.data.partyJoinDate ? response.data.partyJoinDate.split("T")[0] : "",
          partyOfficialDate: response.data.partyOfficialDate ? response.data.partyOfficialDate.split("T")[0] : "",
          health: response.data.health ?? "",
          familyPolicy: response.data.familyPolicy ?? "",
          socialOrgJoinDate: response.data.socialOrgJoinDate ? response.data.socialOrgJoinDate.split("T")[0] : "",
          enlistmentDate: response.data.enlistmentDate ? response.data.enlistmentDate.split("T")[0] : "",
          dischargeDate: response.data.dischargeDate ? response.data.dischargeDate.split("T")[0] : "",
          highestMilitaryRank: response.data.highestMilitaryRank ?? "",
          highestTitle: response.data.highestTitle ?? "",
          forte: response.data.forte ?? "",
          reward: response.data.reward ?? "",
          discipline: response.data.discipline ?? "",
          bhxhNumber: response.data.bhxhNumber ?? "",
        };

        set({
          profile,
          hasProfile: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Non-success response but not a 404
        set({
          profile: null,
          hasProfile: false,
          isLoading: false,
          error: null, // Silent - no error for missing profile
        });
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);

      // Handle 404 silently - this is expected for new users
      if (error.status === 404 || error.message?.includes('404') || error.message?.includes('not found')) {
        set({
          profile: null,
          hasProfile: false,
          isLoading: false,
          error: null, // Silent 404 - no error shown to user
        });
      } else {
        // Other errors should be shown
        const errorMessage = error?.message || "Failed to fetch profile";
        set({
          profile: null,
          hasProfile: false,
          isLoading: false,
          error: errorMessage,
        });
        toast.error(errorMessage);
      }
    }
  },

  createProfile: async (employeeId: string, data: ProfileFormData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName || "");
      formData.append("gender", (data.gender || "male").toUpperCase());
      formData.append("dob", data.dob || "");
      formData.append("birthPlace", data.birthPlace || "");
      formData.append("hometown", data.hometown || "");
      formData.append("ethnicity", data.ethnicity || "");
      formData.append("religion", data.religion || "");
      formData.append("idNumber", data.idNumber || "");
      formData.append("idIssueDate", data.idIssueDate || "");
      formData.append("phone", data.phone || "");
      formData.append("email", data.email || "");
      formData.append("currentAddress", data.currentAddress || "");
      formData.append("permanentAddress", data.permanentAddress || "");
      formData.append("familyPolicy", data.familyPolicy || "");
      formData.append("health", data.health || "");
      formData.append("it", data.it || "");
      formData.append("languageLevel", data.languageLevel || "");
      formData.append("management", data.management || "");
      formData.append("politics", data.politics || "");
      formData.append("specialization", data.specialization || "");
      formData.append("education", data.education || "");
      formData.append("salaryDate", data.salaryDate || "");
      formData.append("salary", data.salary || "");
      formData.append("rank", data.rank || "");
      formData.append("hireAgency", data.hireAgency || "");
      formData.append("hireDate", data.hireDate || "");
      formData.append("jobTitle", data.jobTitle || "");
      formData.append("department", data.department || "");
      formData.append("position", data.position || "");
      formData.append("partyJoinDate", data.partyJoinDate || "");
      formData.append("partyOfficialDate", data.partyOfficialDate || "");
      formData.append("socialOrgJoinDate", data.socialOrgJoinDate || "");
      formData.append("enlistmentDate", data.enlistmentDate || "");
      formData.append("dischargeDate", data.dischargeDate || "");
      formData.append("highestMilitaryRank", data.highestMilitaryRank || "");
      formData.append("highestTitle", data.highestTitle || "");
      formData.append("forte", data.forte || "");
      formData.append("reward", data.reward || "");
      formData.append("discipline", data.discipline || "");
      formData.append("bhxhNumber", data.bhxhNumber || "");
      formData.append("emergencyContactName", "");
      formData.append("emergencyContactRelationship", "");
      formData.append("emergencyContactPhone", data.phone || "");
      formData.append("emergencyContactAddress", data.currentAddress || "");

      if (data.avatar && data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }

      const response: ApiResponse<any> = await api.postFormData(`/profiles/${employeeId}`, formData);

      if (response.success) {
        // Immediately fetch the created profile to get canonical data
        await get().fetchProfile(employeeId);

        toast.success("Tạo hồ sơ thành công!");
        return true;
      } else {
        const errorMessage = response.message || "Failed to create profile";
        set({
          isLoading: false,
          error: errorMessage,
        });
        toast.error(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create profile";
      set({
        isLoading: false,
        error: errorMessage,
      });

      if (error.status === 409 || error.message?.includes('409') || error.message?.includes('already exists')) {
        // Profile already exists - fetch it
        try {
          await get().fetchProfile(employeeId);
          toast.error("Hồ sơ đã tồn tại. Bạn không thể tạo hồ sơ mới.");
        } catch (fetchError) {
          console.error("Failed to fetch existing profile after 409:", fetchError);
        }
      } else if (error.status === 400 || error.message?.includes('validation')) {
        toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đã nhập.");
      } else if (error.status === 413) {
        toast.error("File avatar quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
      } else if (error.status === 415) {
        toast.error("Định dạng file avatar không được hỗ trợ. Vui lòng chọn file JPG, JPEG hoặc PNG.");
      } else {
        toast.error(errorMessage);
      }
      return false;
    }
  },

  checkProfileExists: async (employeeId: string): Promise<boolean> => {
    try {
      const response: ApiResponse<any> = await api.get(`/profiles/${employeeId}`);
      if (response.success && response.data) {
        set({ hasProfile: true });
        return true;
      } else {
        set({ hasProfile: false });
        return false;
      }
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        set({ hasProfile: false });
        return false;
      }
      throw error;
    }
  },



  // Legacy method for backward compatibility - use createProfile instead
  createProfileApi: async (employeeId: string, data: ProfileFormData): Promise<boolean> => {
    return get().createProfile(employeeId, data);
  },

  deleteProfile: async (employeeId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response: ApiResponse = await api.delete(`/profiles/${employeeId}`);

      if (response.success) {
        set({
          profile: null,
          isLoading: false,
          error: null,
        });

        toast.success("Xóa hồ sơ thành công!");
        return true;
      } else {
        const errorMessage = response.message || "Failed to delete profile";
        set({
          isLoading: false,
          error: errorMessage,
        });
        toast.error(errorMessage);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to delete profile";
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => set({ error: null }),

  setProfile: (profile) => set({ profile, hasProfile: !!profile }),
  resetProfile: () => set({ profile: null, hasProfile: false, error: null }),
  updateProfile: (data: Partial<Profile>) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    }));
  },
}));