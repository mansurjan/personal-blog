import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import routes
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import categoriesRoutes from "./routes/categories";

// Import sample data
import { createSampleData } from "./utils/sampleData";
import { database } from "./models/database";

// Load environment variables
// Try to load from config.env file if it exists, otherwise use system environment variables
const configPath = path.join(__dirname, "../config.env");
if (require("fs").existsSync(configPath)) {
	dotenv.config({ path: configPath });
	console.log("Loaded environment variables from config.env");
} else {
	console.log("config.env not found, using system environment variables");
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? ["https://mansurbek.vercel.app"]
				: ["http://localhost:3000"],
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/categories", categoriesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error("Error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Function to ensure admin user exists
const ensureAdminUser = () => {
	const db = database.getDb();

	// Check if admin user exists
	db.get(
		"SELECT COUNT(*) as count FROM admin_users WHERE username = ?",
		["admin"],
		(err, row: any) => {
			if (err) {
				console.error("Error checking admin user:", err);
				return;
			}

			if (row.count === 0) {
				// Create admin user
				const bcrypt = require("bcryptjs");
				const hashedPassword = bcrypt.hashSync("admin123", 10);

				db.run(
					"INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
					["admin", hashedPassword],
					(err) => {
						if (err) {
							console.error("Error creating admin user:", err);
						} else {
							console.log("✅ Admin user created: admin/admin123");
						}
					}
				);
			} else {
				console.log("✅ Admin user already exists");
			}
		}
	);
};

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

	// Ensure admin user exists
	ensureAdminUser();

	// Create sample data on first run
	createSampleData();
});
