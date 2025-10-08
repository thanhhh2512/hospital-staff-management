import { useEffect } from 'react';
import { useAuthStore } from '@/stores';


export function useAuthInit() {
    const { checkAuth, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkAuth();
        }
    }, [checkAuth]);

    return { isAuthenticated };
}

export function useRequireAuth() {
    const { isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        if (typeof window !== 'undefined' && !isLoading && !isAuthenticated) {
            window.location.href = '/login';
        }
    }, [isAuthenticated, isLoading]);

    return { isAuthenticated, isLoading };
}


export function useRequireAdmin() {
    const { user, isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        if (typeof window !== 'undefined' && !isLoading && (!isAuthenticated || user?.role !== 'admin')) {
            window.location.href = '/login';
        }
    }, [isAuthenticated, isLoading, user]);

    return {
        isAuthenticated,
        isLoading,
        isAdmin: user?.role === 'admin'
    };
}