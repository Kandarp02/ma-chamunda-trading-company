import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login page and API routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/admin/users') && request.method === 'GET' ||
    pathname.startsWith('/api/admin/users-new') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated for admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('adminAuth');
    
    if (!authCookie) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Validate the auth data
      const authData = JSON.parse(authCookie.value);
      if (!authData || !authData.username) {
        // Invalid auth, redirect to login
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('adminAuth');
        return response;
      }
    } catch (error) {
      // Invalid cookie format, redirect to login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('adminAuth');
      return response;
    }
  }

  // For admin API routes (POST/PUT/DELETE), check authentication
  if (pathname.startsWith('/api/admin/')) {
    const authCookie = request.cookies.get('adminAuth');
    
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const authData = JSON.parse(authCookie.value);
      if (!authData || !authData.username) {
        return NextResponse.json(
          { success: false, error: 'Invalid authentication' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
