"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && !user) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated, user]);

  useEffect(() => {
    if (!mounted) return;
    const timeout = setTimeout(() => {
      if (!isAuthenticated && !isLoading) {
        router.replace("/login");
      }
    }, 3000); 

    return () => clearTimeout(timeout);
  }, [mounted, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!mounted) return;

    if (!isLoading && !isAuthenticated && !user) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && user && user.role !== "admin") {
      return;
    }
  }, [mounted, isLoading, isAuthenticated, user, router]);

  if (!mounted) {
    return null;
  }

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

  if (user && user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-400">404</h1>
          <p className="text-xl text-gray-600 mt-4">Trang không tồn tại</p>
          <p className="text-gray-500 mt-2">
            Bạn không có quyền truy cập trang này
          </p>
          <button
            onClick={() => router.push("/client/dashboard")}
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
