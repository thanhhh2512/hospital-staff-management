"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSuccess } from "@/components/profile/ProfileSuccess";
import { ProfileEdit } from "@/components/profile/ProfileEdit";
import { ProfilePreview } from "@/components/profile/ProfilePreview";
import { generatePDF } from "@/components/profile/pdfUtils";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      await generatePDF(profileRef.current);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        isLoading={isLoading}
        isSaving={isSaving}
        onSave={handleSave}
        onDownloadPDF={handleDownloadPDF}
      />

      <ProfileSuccess isSuccess={isSuccess} />

      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
          <TabsTrigger value="preview">Xem trước</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <ProfileEdit
            avatarSrc={avatarSrc}
            fileInputRef={fileInputRef}
            handleAvatarUpload={handleAvatarUpload}
          />
        </TabsContent>

        <TabsContent value="preview">
          <ProfilePreview profileRef={profileRef} avatarSrc={avatarSrc} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
