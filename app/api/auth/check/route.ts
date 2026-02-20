import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/check - Check authentication status
export async function GET(request: NextRequest) {
  try {
    // Check for auth token in headers or cookies
    const authHeader = request.headers.get('authorization');
    const cookies = request.headers.get('cookie');
    
    // For simplicity, we'll use a basic token check
    // In production, use proper JWT or session management
    let isAuthenticated = false;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Basic token validation (replace with proper JWT in production)
      isAuthenticated = token === 'admin-session-token';
    } else if (cookies) {
      // Check for auth cookie
      const authCookie = cookies.split(';').find(c => c.trim().startsWith('adminAuth='));
      if (authCookie) {
        const authData = authCookie.split('=')[1];
        if (authData) {
          isAuthenticated = true;
        }
      }
    }

    return NextResponse.json({
      authenticated: isAuthenticated
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
