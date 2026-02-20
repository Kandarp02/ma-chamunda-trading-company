import { NextRequest, NextResponse } from 'next/server';
import { adminQueries } from '@/lib/admin-auth';

// GET /api/admin/users/test-db - Test database consistency
export async function GET() {
  try {
    console.log('Testing database consistency...');
    
    // Get all users
    const users = adminQueries.getAll();
    console.log('Direct DB query result:', users);
    
    return NextResponse.json({
      success: true,
      users: users,
      debug: 'Direct database query from adminQueries.getAll()'
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { success: false, error: 'Database test failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
