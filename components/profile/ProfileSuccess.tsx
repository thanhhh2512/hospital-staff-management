import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileSuccessProps {
  isSuccess: boolean;
}

export function ProfileSuccess({ isSuccess }: ProfileSuccessProps) {
  if (!isSuccess) return null;

  return (
    <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      <AlertDescription>Thông tin đã được lưu thành công!</AlertDescription>
    </Alert>
  );
}
