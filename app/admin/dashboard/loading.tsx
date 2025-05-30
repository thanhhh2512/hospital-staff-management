import { CardSkeleton } from "@/components/table-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang quản trị</h1>
        <p className="text-muted-foreground">
          Quản lý nhân viên và hồ sơ nhân sự
        </p>
      </div>

      <CardSkeleton count={4} />
    </div>
  );
}
