import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/jwt';

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/products',
  '/settings',
  '/orders'
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for api, _next/static, _next/image, favicon.ico
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  let isValidSession = false;

  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      isValidSession = true;
    }
  }

  // If the access token is missing or expired, but we have a refresh token,
  // redirect to the refresh endpoint so that cookies are updated BEFORE
  // the page is server-rendered. This prevents the "Login" button flicker.
  if (!isValidSession && refreshToken) {
    const url = new URL('/api/auth/refresh', request.url);
    url.searchParams.set('redirect_to', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute) {
    if (isValidSession) {
      // If user is already authenticated, redirect away from login/signup to the dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute && !isValidSession) {
    // No valid tokens, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
