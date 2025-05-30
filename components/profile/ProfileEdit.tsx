import { ChangeEvent, RefObject } from "react";
import { PersonalInfo } from "./PersonalInfo";
import { ProfessionalInfo } from "./ProfessionalInfo";
import { TrainingInfo } from "./TrainingInfo";

interface ProfileEditProps {
  avatarSrc: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileEdit({
  avatarSrc,
  fileInputRef,
  handleAvatarUpload,
}: ProfileEditProps) {
  return (
    <div className="space-y-4">
      <PersonalInfo
        avatarSrc={avatarSrc}
        fileInputRef={fileInputRef}
        handleAvatarUpload={handleAvatarUpload}
      />
      <ProfessionalInfo />
      <TrainingInfo />
    </div>
  );
}
