import express from "express";
import { CategoryModel } from "../models/Category";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const categoryModel = new CategoryModel();

// Public routes
router.get("/", async (req, res) => {
	try {
		const categories = await categoryModel.getAll();
		res.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/:slug", async (req, res) => {
	try {
		const { slug } = req.params;
		const category = await categoryModel.getBySlug(slug);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.json(category);
	} catch (error) {
		console.error("Error fetching category:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Admin routes
router.post("/", authenticateToken, async (req, res) => {
	try {
		const { name, slug, description } = req.body;

		if (!name || !slug) {
			return res.status(400).json({ error: "Name and slug are required" });
		}

		const category = await categoryModel.create({
			name,
			slug,
			description,
		});

		res.status(201).json(category);
	} catch (error: any) {
		console.error("Error creating category:", error);
		if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
			res
				.status(400)
				.json({ error: "A category with this name or slug already exists" });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.put("/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { name, slug, description } = req.body;

		const category = await categoryModel.update(parseInt(id), {
			name,
			slug,
			description,
		});

		res.json(category);
	} catch (error: any) {
		console.error("Error updating category:", error);
		if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
			res
				.status(400)
				.json({ error: "A category with this name or slug already exists" });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await categoryModel.delete(parseInt(id));

		if (!deleted) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error("Error deleting category:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
