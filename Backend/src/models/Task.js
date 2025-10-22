const db = require('../config/database');

class Task {
  // Create task
  static async create(userId, title, description, priority = 'medium', category = 'other', dueDate = null) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO tasks (user_id, title, description, priority, category, due_date) VALUES (?, ?, ?, ?, ?, ?)';
      db.run(sql, [userId, title, description, priority, category, dueDate], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            user_id: userId, 
            title, 
            description, 
            priority,
            category,
            due_date: dueDate,
            completed: false 
          });
        }
      });
    });
  }

  // Get all tasks
  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get task by ID
  static async findById(id, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
      db.get(sql, [id, userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Update task
  static async update(id, userId, updates) {
    return new Promise((resolve, reject) => {
      const { title, description, completed, priority, category, dueDate } = updates;
      const sql = `
        UPDATE tasks 
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            completed = COALESCE(?, completed),
            priority = COALESCE(?, priority),
            category = COALESCE(?, category),
            due_date = COALESCE(?, due_date),
            updated_at = datetime('now')
        WHERE id = ? AND user_id = ?
      `;
      
      db.run(sql, [title, description, completed, priority, category, dueDate, id, userId], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Task not found or unauthorized'));
        } else {
          resolve({ success: true, changes: this.changes });
        }
      });
    });
  }

  // Delete task
  static async delete(id, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Task not found or unauthorized'));
        } else {
          resolve({ success: true, changes: this.changes });
        }
      });
    });
  }
}

module.exports = Task;
