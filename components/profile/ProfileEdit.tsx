import { ChangeEvent, RefObject } from "react";
import { PersonalInfo } from "./PersonalInfo";
import { ProfessionalInfo } from "./ProfessionalInfo";
import { TrainingInfo } from "./TrainingInfo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ProfileEditProps {
  avatarSrc: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  isReadOnly?: boolean;
}

export function ProfileEdit({
  avatarSrc,
  fileInputRef,
  onAvatarUpload,
  isReadOnly = false,
}: ProfileEditProps) {
  return (
    <div className="space-y-4">
      {isReadOnly && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Hồ sơ đã được tạo và đang ở chế độ chỉ đọc. Liên hệ admin để chỉnh
            sửa thông tin.
          </AlertDescription>
        </Alert>
      )}
      <PersonalInfo
        avatarSrc={avatarSrc}
        fileInputRef={fileInputRef}
        onAvatarUpload={onAvatarUpload}
        isReadOnly={isReadOnly}
      />
      <ProfessionalInfo isReadOnly={isReadOnly} />
      <TrainingInfo isReadOnly={isReadOnly} />
    </div>
  );
}
