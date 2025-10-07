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

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../config.env") });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? ["https://your-frontend-domain.com"]
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

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

	// Create sample data on first run
	createSampleData();
});
