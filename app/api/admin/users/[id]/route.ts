import { NextRequest, NextResponse } from 'next/server';
import { adminQueries } from '@/lib/admin-auth';
import { query } from '@/lib/database';

// PUT /api/admin/users/[id] - Update admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { username, role, password } = await request.json();

    // Validate input
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Update user
    const updates: any = { username, role: role || 'admin' };
    if (password) {
      updates.password = password;
    }
    
    await adminQueries.update(Number(id), updates);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const idNum = Number(id);
    console.log('Delete request for user ID:', id, 'as number:', idNum);

    // Check if user exists
    const existingUser = await query(
      'SELECT id, username, role, created_at FROM admin_users WHERE id = $1',
      [idNum]
    );
    console.log('User exists check:', existingUser.rows[0]);
    
    if (!existingUser.rows[0]) {
      console.log('User does not exist with ID:', idNum);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of the last admin
    const allUsers = await query('SELECT id FROM admin_users');
    console.log('All users count:', allUsers.rows.length);
    
    if (allUsers.rows.length <= 1) {
      console.log('Cannot delete last admin - only', allUsers.rows.length, 'user(s) remaining');
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    // Delete user
    console.log('Attempting to delete user:', idNum);
    await adminQueries.delete(idNum);
    console.log('User deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
