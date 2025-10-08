"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect authenticated users to their dashboard
        const redirectPath =
          user.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
        router.replace(redirectPath);
      } else {
        // Redirect non-authenticated users to login
        router.replace("/login");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
