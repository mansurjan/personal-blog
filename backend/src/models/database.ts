import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../../blog.db");

export class Database {
	private db: sqlite3.Database;

	constructor() {
		this.db = new sqlite3.Database(dbPath);
		this.initTables();
	}

	private initTables() {
		// Create categories table
		this.db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

		// Create blog_posts table
		this.db.run(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category_id INTEGER,
        published BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

		// Create admin_users table
		this.db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

		// Insert default admin user if not exists
		this.db.get(
			"SELECT COUNT(*) as count FROM admin_users",
			(err, row: any) => {
				if (err) {
					console.error("Error checking admin users:", err);
					return;
				}

				if (row.count === 0) {
					const bcrypt = require("bcryptjs");
					const hashedPassword = bcrypt.hashSync("admin123", 10);
					this.db.run(
						"INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
						["admin", hashedPassword]
					);
					console.log("Default admin user created: admin/admin123");
				}
			}
		);

		// Insert default categories
		this.db.get("SELECT COUNT(*) as count FROM categories", (err, row: any) => {
			if (err) {
				console.error("Error checking categories:", err);
				return;
			}

			if (row.count === 0) {
				const defaultCategories = [
					{
						name: "Technology",
						slug: "technology",
						description: "Posts about technology and programming",
					},
					{
						name: "Lifestyle",
						slug: "lifestyle",
						description: "Posts about lifestyle and personal experiences",
					},
					{
						name: "Travel",
						slug: "travel",
						description: "Posts about travel and adventures",
					},
				];

				const stmt = this.db.prepare(
					"INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)"
				);
				defaultCategories.forEach((category) => {
					stmt.run(category.name, category.slug, category.description);
				});
				stmt.finalize();
				console.log("Default categories created");
			}
		});
	}

	getDb(): sqlite3.Database {
		return this.db;
	}

	close() {
		this.db.close();
	}
}

export const database = new Database();
