import type React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-60">
          <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <div />
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
