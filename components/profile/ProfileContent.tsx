"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProfileEdit } from "@/components/profile/ProfileEdit";
import { ProfilePreview } from "@/components/profile/ProfilePreview";
import { useProfileStore } from "@/stores";
import { useAuthStore } from "@/stores";
import { useTrainingStore } from "@/stores";
import { toast } from "sonner";
import { Loader2, Save, Lock, Info } from "lucide-react";
import type { Profile } from "@/types";
import {
  profileFormSchema,
  getDefaultProfileValues,
  type ProfileFormData as FormData,
} from "@/lib/profileFormSchema";
import { validateImageFile, createFilePreview } from "@/lib/file-utils";

// Store's ProfileFormData interface (from store)
interface StoreProfileFormData extends Omit<Profile, "avatar"> {
  avatar?: File;
}

// Helper function to convert Profile to FormData
function profileToFormData(profile: Profile, employeeId?: string): FormData {
  return {
    employeeId: employeeId || "",
    fullName: profile.fullName || "",
    gender: profile.gender || "male",
    dob: profile.dob || "",
    birthPlace: profile.birthPlace || "",
    hometown: profile.hometown || "",
    ethnicity: profile.ethnicity || "",
    religion: profile.religion || "",
    idNumber: profile.idNumber || "",
    idIssueDate: profile.idIssueDate || "",
    phone: profile.phone || "",
    email: profile.email || "",
    permanentAddress: profile.permanentAddress || "",
    currentAddress: profile.currentAddress || "",
    avatar: null, // Handle separately
    position: profile.position || "",
    department: profile.department || "",
    jobTitle: profile.jobTitle || "",
    hireDate: profile.hireDate || "",
    hireAgency: profile.hireAgency || "",
    rank: profile.rank || "",
    salary: profile.salary || "",
    salaryDate: profile.salaryDate || "",
    education: profile.education || "",
    specialization: profile.specialization || "",
    politics: profile.politics || "",
    management: profile.management || "",
    languageLevel: profile.languageLevel || "",
    it: profile.it || "",
    partyJoinDate: profile.partyJoinDate || "",
    partyOfficialDate: profile.partyOfficialDate || "",
    health: profile.health || "",
    familyPolicy: profile.familyPolicy || "",
    socialOrgJoinDate: profile.socialOrgJoinDate || "",
    enlistmentDate: profile.enlistmentDate || "",
    dischargeDate: profile.dischargeDate || "",
    highestMilitaryRank: profile.highestMilitaryRank || "",
    highestTitle: profile.highestTitle || "",
    forte: profile.forte || "",
    reward: profile.reward || "",
    discipline: profile.discipline || "",
    bhxhNumber: profile.bhxhNumber || "",
    trainings: [], // Will be populated from training store
  };
}

// Main Profile page component
export default function ProfileContent() {
  // Local state
  const [activeTab, setActiveTab] = useState("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Store state
  const { user } = useAuthStore();
  const {
    profile,
    hasProfile,
    isLoading: profileLoading,
    error,
    fetchProfile,
    createProfile,
    clearError,
  } = useProfileStore();
  const { trainings, fetchTrainingsByEmployeeId } = useTrainingStore();

  // Form setup
  const methods = useForm<FormData>({
    defaultValues: getDefaultProfileValues(),
    resolver: zodResolver(profileFormSchema),
    shouldUnregister: false,
    mode: "onChange",
  });

  const {
    reset,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid },
  } = methods;

  const employeeId = user?.employeeId;

  useEffect(() => {
    if (employeeId) {
      fetchProfile(employeeId);
      fetchTrainingsByEmployeeId(employeeId);
    }
  }, [employeeId, fetchProfile, fetchTrainingsByEmployeeId]);

  useEffect(() => {
    if (profile && employeeId) {
      const formData = profileToFormData(profile, employeeId);
      // Map trainings to match the expected form schema
      formData.trainings = (trainings || []).map((training) => ({
        id: training.id,
        school: training.school,
        major: training.major,
        startDate: training.startDate,
        endDate: training.endDate || "", // Handle optional endDate
        type: training.type,
        degree: training.degree,
      }));
      reset(formData);
      setAvatarSrc(profile.avatar || null);
    }
  }, [profile, trainings, employeeId, reset]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleAvatarUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          toast.error(validation.error);
          return;
        }

        setSelectedAvatarFile(file);
        const previewUrl = createFilePreview(file);
        setAvatarSrc(previewUrl);
      }
    },
    []
  );

  const handleCreateProfile = useCallback(() => {
    if (hasProfile) {
      toast.error("Hồ sơ đã được tạo. Liên hệ admin nếu cần thay đổi.");
      return;
    }

    if (!employeeId) {
      toast.error("Không thể lưu: thiếu thông tin người dùng");
      return;
    }

    handleSubmit(
      async (formValues) => {
        setIsSaving(true);

        try {
          const profileData: StoreProfileFormData = {
            fullName: formValues.fullName || "",
            gender: formValues.gender || "male",
            dob: formValues.dob || "",
            birthPlace: formValues.birthPlace || "",
            hometown: formValues.hometown || "",
            ethnicity: formValues.ethnicity || "",
            religion: formValues.religion || "",
            idNumber: formValues.idNumber || "",
            idIssueDate: formValues.idIssueDate || "",
            phone: formValues.phone || "",
            email: formValues.email || "",
            permanentAddress: formValues.permanentAddress || "",
            currentAddress: formValues.currentAddress || "",
            position: formValues.position || "",
            department: formValues.department || "",
            jobTitle: formValues.jobTitle || "",
            hireDate: formValues.hireDate || "",
            hireAgency: formValues.hireAgency || "",
            rank: formValues.rank || "",
            salary: formValues.salary || "",
            salaryDate: formValues.salaryDate || "",
            education: formValues.education || "",
            specialization: formValues.specialization || "",
            politics: formValues.politics || "",
            management: formValues.management || "",
            languageLevel: formValues.languageLevel || "",
            it: formValues.it || "",
            partyJoinDate: formValues.partyJoinDate || "",
            partyOfficialDate: formValues.partyOfficialDate || "",
            health: formValues.health || "",
            familyPolicy: formValues.familyPolicy || "",
            socialOrgJoinDate: formValues.socialOrgJoinDate || "",
            enlistmentDate: formValues.enlistmentDate || "",
            dischargeDate: formValues.dischargeDate || "",
            highestMilitaryRank: formValues.highestMilitaryRank || "",
            highestTitle: formValues.highestTitle || "",
            forte: formValues.forte || "",
            reward: formValues.reward || "",
            discipline: formValues.discipline || "",
            bhxhNumber: formValues.bhxhNumber || "",
            avatar: selectedAvatarFile || undefined,
          };

          const success = await createProfile(employeeId, profileData);

          if (success) {
            setIsSuccess(true);
            setActiveTab("preview");
            setShowCreateForm(false); // Hide create form after success

            setTimeout(() => {
              setIsSuccess(false);
            }, 3000);
          }
        } catch (error: any) {
          console.error("Profile creation error:", error);
          toast.error("Đã xảy ra lỗi khi tạo hồ sơ");
        } finally {
          setIsSaving(false);
        }
      },
      (errors) => {
        const errorMessages = Object.values(errors)
          .map((error: any) => error?.message)
          .filter(Boolean);
        if (errorMessages.length > 0) {
          toast.error(`Vui lòng kiểm tra lại: ${errorMessages[0]}`);
        }
      }
    )();
  }, [hasProfile, employeeId, handleSubmit, createProfile, selectedAvatarFile]);

  if (profileLoading && employeeId) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang kiểm tra hồ sơ...</span>
        </div>
      </div>
    );
  }

  if (!employeeId) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <span className="text-muted-foreground">
            Đang tải thông tin người dùng...
          </span>
        </div>
      </div>
    );
  }

  if (!profileLoading && !hasProfile && !error && !showCreateForm) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lý lịch cá nhân
            </h1>
            <p className="text-muted-foreground">
              Bạn chưa có hồ sơ cá nhân. Hãy tạo hồ sơ để hoàn thiện thông tin.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center h-64">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Chưa có hồ sơ cá nhân</CardTitle>
              <CardDescription>
                Bạn chưa tạo hồ sơ cá nhân. Hãy tạo hồ sơ để hoàn thiện thông
                tin của mình.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                size="lg"
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                Tạo hồ sơ cá nhân
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lý lịch cá nhân
            </h1>
            <p className="text-muted-foreground">
              {hasProfile
                ? "Hồ sơ đã được tạo và đang ở chế độ chỉ đọc. Liên hệ admin để chỉnh sửa thông tin."
                : "Tạo hồ sơ cá nhân của bạn"}
            </p>
          </div>
          <div className="flex gap-2">
            {!hasProfile && showCreateForm && (
              <Button
                onClick={handleCreateProfile}
                disabled={
                  isSaving || !isValid || (!isDirty && !selectedAvatarFile)
                }
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo hồ sơ...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Tạo hồ sơ
                  </>
                )}
              </Button>
            )}

            {!hasProfile && showCreateForm && (
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                size="lg"
              >
                Hủy
              </Button>
            )}

            {hasProfile && (
              <div className="flex items-center gap-2 text-green-600">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Hồ sơ đã được lưu</span>
              </div>
            )}
          </div>
        </div>
        {isSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Hồ sơ đã được tạo thành công! Hồ sơ hiện đã được khóa và chỉ có
              thể xem.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div ref={profileRef}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">
                {hasProfile ? "Xem thông tin" : "Nhập thông tin"}
              </TabsTrigger>
              <TabsTrigger value="preview">Xem trước</TabsTrigger>
            </TabsList>

            <div className={activeTab === "edit" ? "block" : "hidden"}>
              <div className="mt-4">
                <ProfileEdit
                  avatarSrc={avatarSrc}
                  onAvatarUpload={handleAvatarUpload}
                  fileInputRef={fileInputRef}
                  isReadOnly={hasProfile}
                />
              </div>
            </div>

            <div className={activeTab === "preview" ? "block" : "hidden"}>
              <div className="mt-4">
                <ProfilePreview avatarSrc={avatarSrc} />
              </div>
            </div>
          </Tabs>
        </div>

        {!hasProfile && showCreateForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 text-lg">
                Hướng dẫn tạo hồ sơ
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Điền đầy đủ thông tin bắt buộc (có dấu{" "}
                  <span className="text-red-500">*</span>)
                </li>
                <li>Kiểm tra kỹ thông tin trước khi tạo hồ sơ</li>
                <li>
                  Sau khi tạo thành công, hồ sơ sẽ được khóa và chỉ có thể xem
                </li>
                <li>Liên hệ admin nếu cần chỉnh sửa thông tin sau khi tạo</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </FormProvider>
  );
}
