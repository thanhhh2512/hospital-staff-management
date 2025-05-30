"use client";

// Tạo hook use-toast đơn giản
import { useState } from "react";

type ToastProps = {
  title: string;
  description?: string;
  duration?: number;
};

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = ({ title, description, duration = 3000 }: ToastProps) => {
    setToast({ title, description, duration });

    // Tự động ẩn toast sau khoảng thời gian
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return {
    toast: showToast,
    currentToast: toast,
    dismissToast: () => setToast(null),
  };
}
