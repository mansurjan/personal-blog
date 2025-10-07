"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { categoriesAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/types";

export default function EditCategoryPage() {
	const router = useRouter();
	const params = useParams();
	const { isAuthenticated, loading } = useAuth();
	const [category, setCategory] = useState<Category | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		description: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [isAuthenticated, loading, router]);

	useEffect(() => {
		const fetchCategory = async () => {
			try {
				const categoryId = params.id as string;
				const categories = await categoriesAPI.getAll();
				const foundCategory = categories.find(
					(cat) => cat.id === parseInt(categoryId)
				);

				if (foundCategory) {
					setCategory(foundCategory);
					setFormData({
						name: foundCategory.name,
						slug: foundCategory.slug,
						description: foundCategory.description || "",
					});
				} else {
					setError("Category not found");
				}
			} catch {
				setError("Failed to load category");
			}
		};

		if (params.id) {
			fetchCategory();
		}
	}, [params.id]);

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Auto-generate slug from name
		if (name === "name") {
			setFormData((prev) => ({
				...prev,
				slug: generateSlug(value),
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			if (!category) return;

			await categoriesAPI.update(category.id, formData);
			router.push("/admin/categories");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to update category");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
						<p className="text-gray-600 mt-1">
							Update the category information below.
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
							<p className="text-red-800">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-2">
								Category Name *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter category name"
							/>
						</div>

						<div>
							<label
								htmlFor="slug"
								className="block text-sm font-medium text-gray-700 mb-2">
								Slug *
							</label>
							<input
								type="text"
								id="slug"
								name="slug"
								value={formData.slug}
								onChange={handleInputChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="category-slug"
							/>
							<p className="text-sm text-gray-500 mt-1">
								URL-friendly version of the name. Auto-generated from the name.
							</p>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter category description (optional)"
							/>
						</div>

						<div className="flex items-center justify-between pt-6 border-t border-gray-200">
							<button
								type="button"
								onClick={() => router.push("/admin/categories")}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
								{isSubmitting ? "Updating..." : "Update Category"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
