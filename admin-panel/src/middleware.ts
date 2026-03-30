import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes ONLY accessible by SUPER_ADMIN (never visible/accessible by any STAFF)
const SUPER_ADMIN_ONLY_ROUTES = [
  '/settings',
  '/reports',
];

// All known admin routes (used to check if we should protect the path)
const ALL_ADMIN_ROUTES = [
  '/dashboard',
  '/schedule',
  '/registration',
  '/coaches',
  '/payments',
  '/notifications',
  '/reminders',
  '/reports',
  '/settings',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-admin routes (login page, static assets, api routes)
  if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('nsm_admin_token')?.value;

  // No token - redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || 'your-access-secret-min-64-chars-long-replace-this');
    const { payload } = await jwtVerify(token, secret);
    
    const role = payload.role as string;
    const branchId = payload.branchId as string | undefined;
    const permissions = payload.permissions as string[] | undefined;

    // SUPER_ADMIN can access everything
    if (role === 'SUPER_ADMIN') {
      return NextResponse.next();
    }

    // STAFF role checks
    if (role === 'STAFF') {
      // Must have a branchId
      if (!branchId) {
        return NextResponse.redirect(new URL('/?expired=1', request.url));
      }

      // Determine which top-level route is being accessed
      // e.g. /registration/frozen -> 'registration', /settings -> 'settings'
      const routeKey = pathname.split('/')[1] || 'dashboard';

      // Block SUPER_ADMIN-only routes regardless of permissions
      const isSuperAdminOnly = SUPER_ADMIN_ONLY_ROUTES.some(r => pathname.startsWith(r));
      if (isSuperAdminOnly) {
        return NextResponse.redirect(new URL('/dashboard?unauthorized=1', request.url));
      }

      // If permissions are in the token, enforce them against the route
      if (permissions && Array.isArray(permissions)) {
        const hasPermission = permissions.includes(routeKey);
        if (!hasPermission) {
          // STAFF is trying to access a route their branch doesn't have permission for
          return NextResponse.redirect(new URL('/dashboard?unauthorized=1', request.url));
        }
      }

      return NextResponse.next();
    }

    // Any other role - redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  } catch (err) {
    // Invalid or expired token - redirect to login
    return NextResponse.redirect(new URL('/?expired=1', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for:
     * - / (login page)
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - /favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico|$).*)',
  ],
};
