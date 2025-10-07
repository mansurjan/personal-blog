import { database } from "./database";

export interface Category {
	id?: number;
	name: string;
	slug: string;
	description?: string;
	created_at?: string;
}

export class CategoryModel {
	private db = database.getDb();

	async getAll(): Promise<Category[]> {
		return new Promise((resolve, reject) => {
			this.db.all(
				"SELECT * FROM categories ORDER BY name ASC",
				(err, rows: any[]) => {
					if (err) {
						reject(err);
						return;
					}

					const categories = rows.map((row) => ({
						id: row.id,
						name: row.name,
						slug: row.slug,
						description: row.description,
						created_at: row.created_at,
					}));

					resolve(categories);
				}
			);
		});
	}

	async getBySlug(slug: string): Promise<Category | null> {
		return new Promise((resolve, reject) => {
			this.db.get(
				"SELECT * FROM categories WHERE slug = ?",
				[slug],
				(err, row: any) => {
					if (err) {
						reject(err);
						return;
					}

					if (!row) {
						resolve(null);
						return;
					}

					resolve({
						id: row.id,
						name: row.name,
						slug: row.slug,
						description: row.description,
						created_at: row.created_at,
					});
				}
			);
		});
	}

	async create(
		category: Omit<Category, "id" | "created_at">
	): Promise<Category> {
		return new Promise((resolve, reject) => {
			const query = `
        INSERT INTO categories (name, slug, description)
        VALUES (?, ?, ?)
      `;

			this.db.run(
				query,
				[category.name, category.slug, category.description],
				function (err) {
					if (err) {
						reject(err);
						return;
					}

					// Return the created category
					database
						.getDb()
						.get(
							"SELECT * FROM categories WHERE id = ?",
							[this.lastID],
							(err, row: any) => {
								if (err) {
									reject(err);
									return;
								}

								resolve({
									id: row.id,
									name: row.name,
									slug: row.slug,
									description: row.description,
									created_at: row.created_at,
								});
							}
						);
				}
			);
		});
	}

	async update(id: number, category: Partial<Category>): Promise<Category> {
		return new Promise((resolve, reject) => {
			const fields = [];
			const values = [];

			if (category.name !== undefined) {
				fields.push("name = ?");
				values.push(category.name);
			}
			if (category.slug !== undefined) {
				fields.push("slug = ?");
				values.push(category.slug);
			}
			if (category.description !== undefined) {
				fields.push("description = ?");
				values.push(category.description);
			}

			values.push(id);

			const query = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;

			this.db.run(query, values, function (err) {
				if (err) {
					reject(err);
					return;
				}

				// Return the updated category
				database
					.getDb()
					.get(
						"SELECT * FROM categories WHERE id = ?",
						[id],
						(err, row: any) => {
							if (err) {
								reject(err);
								return;
							}

							resolve({
								id: row.id,
								name: row.name,
								slug: row.slug,
								description: row.description,
								created_at: row.created_at,
							});
						}
					);
			});
		});
	}

	async delete(id: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.changes > 0);
			});
		});
	}
}
