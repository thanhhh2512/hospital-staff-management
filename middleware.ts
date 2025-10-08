import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies or local storage
    // Since middleware runs on the server, we need to get token from cookies if available
    const token = request.cookies.get('hospital_access_token')?.value;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // For admin routes, we need to check user role
        // Since we can't decode JWT in middleware without extra setup,
        // we'll handle role checking on the client side and redirect here

        // Create a response that will trigger client-side role check
        const response = NextResponse.next();
        response.headers.set('x-check-admin-role', 'true');
        return response;
    }

    // Client routes protection
    if (pathname.startsWith('/client')) {
        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect authenticated users away from auth pages
    if (token && (pathname === '/login' || pathname === '/register')) {
        // Default redirect to client dashboard
        // The actual role-based redirect will be handled on client side
        return NextResponse.redirect(new URL('/client/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/client/:path*',
        '/login',
        '/register'
    ]
};