import express from "express";
import { BlogPostModel } from "../models/BlogPost";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const blogPostModel = new BlogPostModel();

// Public routes
router.get("/", async (req, res) => {
	try {
		const { category, search, published = "true" } = req.query;
		const isPublished = published === "true";

		let posts;

		if (search) {
			posts = await blogPostModel.search(search as string, isPublished);
		} else if (category) {
			posts = await blogPostModel.getByCategory(
				category as string,
				isPublished
			);
		} else {
			posts = await blogPostModel.getAll(isPublished);
		}

		res.json(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/:slug", async (req, res) => {
	try {
		const { slug } = req.params;
		const post = await blogPostModel.getBySlug(slug);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.json(post);
	} catch (error) {
		console.error("Error fetching post:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Admin routes
router.post("/", authenticateToken, async (req, res) => {
	try {
		const { title, slug, content, excerpt, category_id, published } = req.body;

		if (!title || !slug || !content) {
			return res
				.status(400)
				.json({ error: "Title, slug, and content are required" });
		}

		const post = await blogPostModel.create({
			title,
			slug,
			content,
			excerpt,
			category_id: category_id ? parseInt(category_id) : undefined,
			published: published || false,
		});

		res.status(201).json(post);
	} catch (error: any) {
		console.error("Error creating post:", error);
		if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
			res.status(400).json({ error: "A post with this slug already exists" });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.put("/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { title, slug, content, excerpt, category_id, published } = req.body;

		const post = await blogPostModel.update(parseInt(id), {
			title,
			slug,
			content,
			excerpt,
			category_id: category_id ? parseInt(category_id) : undefined,
			published,
		});

		res.json(post);
	} catch (error: any) {
		console.error("Error updating post:", error);
		if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
			res.status(400).json({ error: "A post with this slug already exists" });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await blogPostModel.delete(parseInt(id));

		if (!deleted) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
