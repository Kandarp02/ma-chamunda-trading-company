import { getDatabase, closeDatabase, reopenDatabase } from './database';

// Admin user functions
export const adminQueries = {
  // Authenticate user
  authenticate: (username: string, password: string) => {
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM AdminUsers WHERE username = ?').get(username) as any;
    if (user && user.password === password) {
      // Remove password before returning
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  // Get all admin users
  getAll: () => {
    const db = getDatabase();
    const users = db.prepare('SELECT id, username, role, created_at FROM AdminUsers').all();
    return users;
  },

  // Create new admin user
  create: (username: string, password: string, role: string = 'admin') => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO AdminUsers (username, password, role)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, password, role);
    // Force database to write to disk
    closeDatabase();
    return result;
  },

  // Update admin user
  update: (id: number, username: string, role: string) => {
    const db = getDatabase();
    try {
      const stmt = db.prepare(`
        UPDATE AdminUsers 
        SET username = ?, role = ?
        WHERE id = ?
      `);
      const result = stmt.run(username, role, id);
      
      // Force database to write changes to disk
      db.exec('PRAGMA synchronous = FULL');
      return result;
    } catch (error) {
      console.error('Update operation error:', error);
      throw error;
    }
  },

  // Update password
  updatePassword: (id: number, password: string) => {
    const db = getDatabase();
    try {
      const stmt = db.prepare(`
        UPDATE AdminUsers 
        SET password = ?
        WHERE id = ?
      `);
      const result = stmt.run(password, id);
      
      // Force database to write changes to disk
      db.exec('PRAGMA synchronous = FULL');
      return result;
    } catch (error) {
      console.error('Update password operation error:', error);
      throw error;
    }
  },

  // Delete admin user
  delete: (id: number) => {
    const db = getDatabase();
    try {
      const stmt = db.prepare('DELETE FROM AdminUsers WHERE id = ?');
      const result = stmt.run(id);
      
      // Force database to write changes to disk
      db.exec('PRAGMA synchronous = FULL');
      return result;
    } catch (error) {
      console.error('Delete operation error:', error);
      throw error;
    }
  }
};
