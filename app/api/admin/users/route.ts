import { NextRequest, NextResponse } from 'next/server';
import { adminQueries } from '@/lib/admin-auth';

// GET /api/admin/users - Get all admin users
export async function GET() {
  try {
    const users = await adminQueries.getAll();
    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new admin user
export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Create user
    const result = await adminQueries.create(username, password, role || 'admin');

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        username: result.username,
        role: result.role
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
