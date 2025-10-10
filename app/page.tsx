"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    if (!isAuthenticated && !user && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, user, isLoading, checkAuth]);

  useEffect(() => {
    // Only redirect if we have clear authentication state
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard based on role
      const redirectPath =
        user.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking authentication
  // Note: Unauthenticated users should be redirected by middleware before reaching this component
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Đang chuyển hướng...</p>
        <p className="text-xs text-muted-foreground">
          Nếu trang này hiển thị quá lâu, vui lòng{" "}
          <button
            onClick={() => router.push("/login")}
            className="underline text-blue-600 hover:text-blue-800"
          >
            đăng nhập lại
          </button>
        </p>
      </div>
    </div>
  );
}
