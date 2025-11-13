import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

export interface User {
  id?: number;
  email: string;
  password: string;
  createdAt?: string;
}

export interface DataMapping {
  id?: number;
  title: string;
  description?: string;
  department: string;
  dataSubjectType: string;
  userId: number;
  createdAt?: string;
}

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../database.sqlite');
    this.db = new sqlite3.Database(dbPath);
    this.initializeTables();
  }

  private initializeTables(): void {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createDataMappingsTable = `
      CREATE TABLE IF NOT EXISTS data_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        department TEXT NOT NULL,
        data_subject_type TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    this.db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('✅ Users table ready');
      }
    });

    this.db.run(createDataMappingsTable, (err) => {
      if (err) {
        console.error('Error creating data_mappings table:', err);
      } else {
        console.log('✅ Data mappings table ready');
      }
    });
  }

  async createUser(email: string, hashedPassword: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
      this.db.run(query, [email, hashedPassword], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      this.db.get(query, [email], (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      this.db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Data Mapping methods
  async createDataMapping(data: Omit<DataMapping, 'id' | 'createdAt'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO data_mappings (title, description, department, data_subject_type, user_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      this.db.run(
        query,
        [data.title, data.description || '', data.department, data.dataSubjectType, data.userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async getAllDataMappings(userId: number): Promise<DataMapping[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM data_mappings WHERE user_id = ? ORDER BY created_at DESC';
      this.db.all(query, [userId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const mappings = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            department: row.department,
            dataSubjectType: row.data_subject_type,
            userId: row.user_id,
            createdAt: row.created_at
          }));
          resolve(mappings);
        }
      });
    });
  }

  async getDataMappingById(id: number, userId: number): Promise<DataMapping | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM data_mappings WHERE id = ? AND user_id = ?';
      this.db.get(query, [id, userId], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            title: row.title,
            description: row.description,
            department: row.department,
            dataSubjectType: row.data_subject_type,
            userId: row.user_id,
            createdAt: row.created_at
          });
        }
      });
    });
  }

  async updateDataMapping(id: number, userId: number, data: Partial<DataMapping>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE data_mappings
        SET title = ?, description = ?, department = ?, data_subject_type = ?
        WHERE id = ? AND user_id = ?
      `;
      this.db.run(
        query,
        [data.title, data.description || '', data.department, data.dataSubjectType, id, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  async deleteDataMapping(id: number, userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM data_mappings WHERE id = ? AND user_id = ?';
      this.db.run(query, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
}