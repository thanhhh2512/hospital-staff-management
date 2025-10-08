import { create } from "zustand";
import { api, TokenManager, type ApiResponse } from "@/lib/api";
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    role: "admin" | "client";
    isActive: boolean;
    employeeId: string; 
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (employeeId: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    getProfile: () => Promise<void>;
    clearError: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,

    checkAuth: () => {
        const token = TokenManager.getAccessToken();

        if (token) {
            set({ isAuthenticated: true, isLoading: false });
            // Optionally fetch user profile here
            get().getProfile();
        } else {
            // No token found, clear auth state
            set({
                isAuthenticated: false,
                user: null,
                isLoading: false
            });
        }
    },

    login: async (employeeId: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
            const response: ApiResponse<any> = await api.post("/auth/login", { employeeId, password });

            if (response.success && response.data) {
                const data = response.data;

                // Handle different response structures
                let user: User;
                let accessToken: string;
                let refreshToken: string;

                // Check if response has tokens structure
                if (data.tokens && data.tokens.accessToken) {
                    user = data.user;
                    accessToken = data.tokens.accessToken;
                    refreshToken = data.tokens.refreshToken;
                } else if (data.accessToken) {
                    // Direct token structure
                    user = data.user || data;
                    accessToken = data.accessToken;
                    refreshToken = data.refreshToken;
                } else {
                    throw new Error("Invalid response structure: missing tokens");
                }

                // Validate required fields
                if (!accessToken || !refreshToken) {
                    throw new Error("Missing access token or refresh token");
                }

                // Store tokens
                TokenManager.setTokens(accessToken, refreshToken);

                // Update state
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });

                toast.success("Đăng nhập thành công!");
                return true;
            }

            const errorMessage = response.message || "Đăng nhập thất bại";
            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            return false;
        } catch (error: any) {
            console.error("Login error:", error); // Debug log
            const message = error?.message || "Đăng nhập thất bại";
            set({ isLoading: false, error: message });
            toast.error(message);
            return false;
        }
    },

    logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
            // Call logout endpoint if token exists
            const token = TokenManager.getAccessToken();
            if (token) {
                await api.post("/auth/logout");
            }
        } catch (error) {
            // Ignore logout API errors - proceed with client logout
        } finally {
            // Clear tokens and state regardless of API response
            TokenManager.clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });

            toast.success("Logged out successfully");
        }
    },

    refreshToken: async (): Promise<boolean> => {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
            set({ isAuthenticated: false, user: null });
            return false;
        }

        try {
            const response: ApiResponse<{
                accessToken: string;
                refreshToken: string;
            }> = await api.post("/auth/refresh-token", { refreshToken });

            if (response.success && response.data) {
                TokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
                return true;
            }

            // Refresh failed, clear auth state
            TokenManager.clearTokens();
            set({ isAuthenticated: false, user: null });
            return false;
        } catch (error) {
            TokenManager.clearTokens();
            set({ isAuthenticated: false, user: null });
            return false;
        }
    },

    getProfile: async (): Promise<void> => {
        const token = TokenManager.getAccessToken();
        if (!token) return;

        try {
            const response: ApiResponse<User> = await api.get("/auth/profile");

            if (response.success && response.data) {
                set({
                    user: response.data,
                    isAuthenticated: true,
                });
            } else {
                console.warn("🔍 Auth Store - getProfile failed or no data:", response);
            }
        } catch (error) {
            // If profile fetch fails, user might be logged out
            console.error("🔍 Auth Store - Failed to fetch profile:", error);
        }
    },

    clearError: () => set({ error: null }),
}));