import { database } from "./database";

export interface BlogPost {
	id?: number;
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	category_id?: number;
	published: boolean;
	created_at?: string;
	updated_at?: string;
	category?: {
		id: number;
		name: string;
		slug: string;
	};
}

export class BlogPostModel {
	private db = database.getDb();

	async getAll(published: boolean = true): Promise<BlogPost[]> {
		return new Promise((resolve, reject) => {
			const query = published
				? `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE bp.published = 1 
           ORDER BY bp.created_at DESC`
				: `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           ORDER BY bp.created_at DESC`;

			this.db.all(query, (err, rows: any[]) => {
				if (err) {
					reject(err);
					return;
				}

				const posts = rows.map((row) => ({
					id: row.id,
					title: row.title,
					slug: row.slug,
					content: row.content,
					excerpt: row.excerpt,
					category_id: row.category_id,
					published: Boolean(row.published),
					created_at: row.created_at,
					updated_at: row.updated_at,
					category: row.category_name
						? {
								id: row.category_id,
								name: row.category_name,
								slug: row.category_slug,
						  }
						: undefined,
				}));

				resolve(posts);
			});
		});
	}

	async getBySlug(
		slug: string,
		published: boolean = true
	): Promise<BlogPost | null> {
		return new Promise((resolve, reject) => {
			const query = published
				? `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE bp.slug = ? AND bp.published = 1`
				: `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE bp.slug = ?`;

			this.db.get(query, [slug], (err, row: any) => {
				if (err) {
					reject(err);
					return;
				}

				if (!row) {
					resolve(null);
					return;
				}

				const post: BlogPost = {
					id: row.id,
					title: row.title,
					slug: row.slug,
					content: row.content,
					excerpt: row.excerpt,
					category_id: row.category_id,
					published: Boolean(row.published),
					created_at: row.created_at,
					updated_at: row.updated_at,
					category: row.category_name
						? {
								id: row.category_id,
								name: row.category_name,
								slug: row.category_slug,
						  }
						: undefined,
				};

				resolve(post);
			});
		});
	}

	async getByCategory(
		categorySlug: string,
		published: boolean = true
	): Promise<BlogPost[]> {
		return new Promise((resolve, reject) => {
			const query = published
				? `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE c.slug = ? AND bp.published = 1 
           ORDER BY bp.created_at DESC`
				: `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE c.slug = ? 
           ORDER BY bp.created_at DESC`;

			this.db.all(query, [categorySlug], (err, rows: any[]) => {
				if (err) {
					reject(err);
					return;
				}

				const posts = rows.map((row) => ({
					id: row.id,
					title: row.title,
					slug: row.slug,
					content: row.content,
					excerpt: row.excerpt,
					category_id: row.category_id,
					published: Boolean(row.published),
					created_at: row.created_at,
					updated_at: row.updated_at,
					category: row.category_name
						? {
								id: row.category_id,
								name: row.category_name,
								slug: row.category_slug,
						  }
						: undefined,
				}));

				resolve(posts);
			});
		});
	}

	async search(query: string, published: boolean = true): Promise<BlogPost[]> {
		return new Promise((resolve, reject) => {
			const searchQuery = published
				? `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE (bp.title LIKE ? OR bp.content LIKE ? OR bp.excerpt LIKE ?) 
           AND bp.published = 1 
           ORDER BY bp.created_at DESC`
				: `SELECT bp.*, c.name as category_name, c.slug as category_slug 
           FROM blog_posts bp 
           LEFT JOIN categories c ON bp.category_id = c.id 
           WHERE (bp.title LIKE ? OR bp.content LIKE ? OR bp.excerpt LIKE ?) 
           ORDER BY bp.created_at DESC`;

			const searchTerm = `%${query}%`;

			this.db.all(
				searchQuery,
				[searchTerm, searchTerm, searchTerm],
				(err, rows: any[]) => {
					if (err) {
						reject(err);
						return;
					}

					const posts = rows.map((row) => ({
						id: row.id,
						title: row.title,
						slug: row.slug,
						content: row.content,
						excerpt: row.excerpt,
						category_id: row.category_id,
						published: Boolean(row.published),
						created_at: row.created_at,
						updated_at: row.updated_at,
						category: row.category_name
							? {
									id: row.category_id,
									name: row.category_name,
									slug: row.category_slug,
							  }
							: undefined,
					}));

					resolve(posts);
				}
			);
		});
	}

	async create(
		post: Omit<BlogPost, "id" | "created_at" | "updated_at">
	): Promise<BlogPost> {
		return new Promise((resolve, reject) => {
			const query = `
        INSERT INTO blog_posts (title, slug, content, excerpt, category_id, published)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

			this.db.run(
				query,
				[
					post.title,
					post.slug,
					post.content,
					post.excerpt,
					post.category_id,
					post.published ? 1 : 0,
				],
				function (err) {
					if (err) {
						reject(err);
						return;
					}

					// Return the created post
					database
						.getDb()
						.get(
							"SELECT * FROM blog_posts WHERE id = ?",
							[this.lastID],
							(err, row: any) => {
								if (err) {
									reject(err);
									return;
								}

								resolve({
									id: row.id,
									title: row.title,
									slug: row.slug,
									content: row.content,
									excerpt: row.excerpt,
									category_id: row.category_id,
									published: Boolean(row.published),
									created_at: row.created_at,
									updated_at: row.updated_at,
								});
							}
						);
				}
			);
		});
	}

	async update(id: number, post: Partial<BlogPost>): Promise<BlogPost> {
		return new Promise((resolve, reject) => {
			const fields = [];
			const values = [];

			if (post.title !== undefined) {
				fields.push("title = ?");
				values.push(post.title);
			}
			if (post.slug !== undefined) {
				fields.push("slug = ?");
				values.push(post.slug);
			}
			if (post.content !== undefined) {
				fields.push("content = ?");
				values.push(post.content);
			}
			if (post.excerpt !== undefined) {
				fields.push("excerpt = ?");
				values.push(post.excerpt);
			}
			if (post.category_id !== undefined) {
				fields.push("category_id = ?");
				values.push(post.category_id);
			}
			if (post.published !== undefined) {
				fields.push("published = ?");
				values.push(post.published ? 1 : 0);
			}

			fields.push("updated_at = CURRENT_TIMESTAMP");
			values.push(id);

			const query = `UPDATE blog_posts SET ${fields.join(", ")} WHERE id = ?`;

			this.db.run(query, values, function (err) {
				if (err) {
					reject(err);
					return;
				}

				// Return the updated post
				database
					.getDb()
					.get(
						"SELECT * FROM blog_posts WHERE id = ?",
						[id],
						(err, row: any) => {
							if (err) {
								reject(err);
								return;
							}

							resolve({
								id: row.id,
								title: row.title,
								slug: row.slug,
								content: row.content,
								excerpt: row.excerpt,
								category_id: row.category_id,
								published: Boolean(row.published),
								created_at: row.created_at,
								updated_at: row.updated_at,
							});
						}
					);
			});
		});
	}

	async delete(id: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM blog_posts WHERE id = ?", [id], function (err) {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.changes > 0);
			});
		});
	}
}
