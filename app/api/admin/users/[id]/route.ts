import { NextRequest, NextResponse } from 'next/server';
import { adminQueries } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/database';

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
    if (password) {
      // Update with password
      adminQueries.updatePassword(Number(id), password);
      adminQueries.update(Number(id), username, role || 'admin');
    } else {
      // Update without password
      adminQueries.update(Number(id), username, role || 'admin');
    }

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

    // Use the same database logic as GET route
    const db = getDatabase();
    
    // Check if user exists directly
    const existingUser = db.prepare('SELECT id, username, role, created_at FROM AdminUsers WHERE id = ?').get(idNum);
    console.log('User exists check:', existingUser);
    
    if (!existingUser) {
      console.log('User does not exist with ID:', idNum);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of the last admin
    const allUsers = db.prepare('SELECT id, username, role, created_at FROM AdminUsers').all();
    console.log('All users:', allUsers);
    
    if (allUsers.length <= 1) {
      console.log('Cannot delete last admin - only', allUsers.length, 'user(s) remaining');
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    // Delete user
    console.log('Attempting to delete user:', idNum);
    const stmt = db.prepare('DELETE FROM AdminUsers WHERE id = ?');
    const result = stmt.run(idNum);
    console.log('Delete result:', result);

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
