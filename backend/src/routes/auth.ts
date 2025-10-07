import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { database } from "../models/database";

const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ error: "Username and password are required" });
		}

		const db = database.getDb();

		db.get(
			"SELECT * FROM admin_users WHERE username = ?",
			[username],
			async (err, user: any) => {
				if (err) {
					console.error("Database error:", err);
					return res.status(500).json({ error: "Internal server error" });
				}

				if (!user) {
					return res.status(401).json({ error: "Invalid credentials" });
				}

				const isValidPassword = await bcrypt.compare(
					password,
					user.password_hash
				);

				if (!isValidPassword) {
					return res.status(401).json({ error: "Invalid credentials" });
				}

				const token = jwt.sign(
					{ id: user.id, username: user.username },
					process.env.JWT_SECRET || "fallback-secret",
					{ expiresIn: "24h" }
				);

				res.json({
					token,
					user: {
						id: user.id,
						username: user.username,
					},
				});
			}
		);
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/verify", (req, res) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "No token provided" });
	}

	jwt.verify(
		token,
		process.env.JWT_SECRET || "fallback-secret",
		(err, user: any) => {
			if (err) {
				return res.status(403).json({ error: "Invalid token" });
			}
			res.json({ valid: true, user });
		}
	);
});

// Emergency admin user creation endpoint (for production issues)
router.post("/create-admin", async (req, res) => {
	try {
		const { secret } = req.body;
		
		// Simple secret check to prevent unauthorized admin creation
		if (secret !== "emergency-admin-2024") {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const db = database.getDb();
		
		// Check if admin user already exists
		db.get("SELECT COUNT(*) as count FROM admin_users WHERE username = ?", ["admin"], (err, row: any) => {
			if (err) {
				console.error("Error checking admin user:", err);
				return res.status(500).json({ error: "Database error" });
			}

			if (row.count > 0) {
				return res.json({ message: "Admin user already exists" });
			}

			// Create admin user
			const hashedPassword = bcrypt.hashSync("admin123", 10);
			
			db.run(
				"INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
				["admin", hashedPassword],
				(err) => {
					if (err) {
						console.error("Error creating admin user:", err);
						return res.status(500).json({ error: "Failed to create admin user" });
					}
					
					res.json({ 
						message: "Admin user created successfully",
						credentials: {
							username: "admin",
							password: "admin123"
						}
					});
				}
			);
		});
	} catch (error: any) {
		console.error("Error in create-admin:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
