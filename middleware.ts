import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Fast, cookie-only check
    const token = request.cookies.get('hospital_access_token')?.value;

    // Guard admin area
    if (!token && pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Guard client area
    if (!token && pathname.startsWith('/client')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from login/register
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/client/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Exclude Next internals and static assets from middleware
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:js|mjs|css|map|json|png|jpg|jpeg|gif|svg|webp|ico|ttf|woff|woff2)).*)',
    ],
};