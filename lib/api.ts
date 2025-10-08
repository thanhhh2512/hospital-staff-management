import { toast } from "sonner";

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    errors?: Record<string, string[]>;
}

interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

// Token management
class TokenManager {
    private static readonly ACCESS_TOKEN_KEY = 'hospital_access_token';
    private static readonly REFRESH_TOKEN_KEY = 'hospital_refresh_token';

    static getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    static getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

        // Also set cookies for middleware access
        document.cookie = `${this.ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
        document.cookie = `${this.REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; samesite=strict`;
    }

    static clearTokens(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);

        // Also clear cookies
        document.cookie = `${this.ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}

// API Client class
class ApiClient {
    private baseURL: string;
    private isRefreshing = false;
    private refreshPromise: Promise<string | null> | null = null;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    }

    private async makeRequest<T>(
        endpointOrUrl: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = endpointOrUrl.startsWith('http') ? endpointOrUrl : `${this.baseURL}${endpointOrUrl}`;
        const accessToken = TokenManager.getAccessToken();

        const headers: Record<string, string> = {};

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (options.headers) {
            Object.assign(headers, options.headers);
        }

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401 && accessToken) {
                const newToken = await this.handleTokenRefresh();
                if (newToken) {
                    headers.Authorization = `Bearer ${newToken}`;
                    const retryResponse = await fetch(url, {
                        ...options,
                        headers,
                    });
                    return this.handleResponse<T>(retryResponse);
                }
            }

            return this.handleResponse<T>(response);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        try {
            if (response.status === 304) {
                return {
                    success: true,
                    message: 'Data not modified',
                    data: null,
                    cached: true
                } as unknown as T;
            }

            if (!response.ok) {
                let errorMessage = 'An error occurred';
                let errorData: any = {};

                if (isJson) {
                    try {
                        errorData = await response.json();
                        errorMessage = errorData.message || errorData.error || 'An error occurred';
                    } catch (parseError) {
                        console.error('Failed to parse error JSON:', parseError);
                    }
                } else {
                    errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
                }

                const apiError: ApiError = {
                    message: errorMessage,
                    status: response.status,
                    errors: errorData.errors,
                };
                throw apiError;
            }

            if (isJson) {
                const data = await response.json();
                return data;
            } else {
                return response.text() as unknown as T;
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes('ApiError')) {
                throw error;
            }

            console.error('Response handling error:', error);
            throw new Error('Failed to process server response');
        }
    }

    private async handleTokenRefresh(): Promise<string | null> {
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
            TokenManager.clearTokens();
            return null;
        }

        this.isRefreshing = true;
        this.refreshPromise = this.performTokenRefresh(refreshToken);

        try {
            const newToken = await this.refreshPromise;
            return newToken;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    private async performTokenRefresh(refreshToken: string): Promise<string | null> {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                TokenManager.clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return null;
            }

            const data: ApiResponse<{ accessToken: string; refreshToken: string }> = await response.json();

            if (data.success && data.data) {
                TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
                return data.data.accessToken;
            }

            return null;
        } catch (error) {
            TokenManager.clearTokens();
            return null;
        }
    }

    private handleError(error: any): void {
        console.error('API Error:', error); 

        let message = 'Đã xảy ra lỗi không mong muốn';

        if (error instanceof Error) {
            message = error.message;
        } else if (error?.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }
        if (!message.toLowerCase().includes('authentication') &&
            !message.toLowerCase().includes('unauthorized')) {
            toast.error(message);
        }
    }

    // HTTP Methods
    async get<T>(endpoint: string, params?: Record<string, any>, options?: { noCache?: boolean }): Promise<T> {
        const url = new URL(`${this.baseURL}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const requestOptions: RequestInit = {
            method: 'GET',
        };

        if (options?.noCache) {
            const headers = new Headers();
            headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
            headers.append('Pragma', 'no-cache');
            headers.append('Expires', '0');
            requestOptions.headers = headers;
        }

        return this.makeRequest<T>(url.toString(), requestOptions);
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'DELETE',
        });
    }

    // File upload method
    async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
        const accessToken = TokenManager.getAccessToken();

        const headers: HeadersInit = {};
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    }

    // Multipart form data method
    async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        const accessToken = TokenManager.getAccessToken();

        const headers: HeadersInit = {};
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    }

    async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        const accessToken = TokenManager.getAccessToken();

        const headers: HeadersInit = {};
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            headers,
            body: formData,
        });
    }
}

const api = new ApiClient();

export { api, TokenManager };
export type { ApiResponse, PaginatedResponse, ApiError };