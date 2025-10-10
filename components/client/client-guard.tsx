"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Loader2 } from "lucide-react";

interface ClientGuardProps {
  children: React.ReactNode;
}

export function ClientGuard({ children }: ClientGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const didRedirect = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch auth once if unknown
  useEffect(() => {
    if (!isAuthenticated && !user && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, user, isLoading, checkAuth]);

  // Single redirect effect with guard against multiple calls
  useEffect(() => {
    if (!mounted || didRedirect.current) return;

    // Not authenticated and not loading - redirect to login
    if (!isLoading && !isAuthenticated && !user) {
      didRedirect.current = true;
      router.replace("/login");
      return;
    }

    // Authenticated but admin role - redirect to admin dashboard
    if (isAuthenticated && user && user.role === "admin") {
      didRedirect.current = true;
      router.replace("/admin/dashboard");
      return;
    }
  }, [mounted, isLoading, isAuthenticated, user, router]);

  if (!mounted) {
    return null;
  }

  // Show loading while auth state is unknown or during loading
  if ((isLoading && !user) || (!isAuthenticated && !user)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Đang kiểm tra quyền truy cập...
          </p>
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

  // User has wrong role
  if (user && user.role !== "client") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-400">403</h1>
          <p className="text-xl text-gray-600 mt-4">Truy cập bị từ chối</p>
          <p className="text-gray-500 mt-2">
            Bạn không có quyền truy cập trang này
          </p>
          <button
            onClick={() =>
              router.push(user.role === "admin" ? "/admin/dashboard" : "/login")
            }
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Về trang chính
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
