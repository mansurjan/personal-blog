"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { postsAPI, categoriesAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BlogPost, Category } from "@/types";

export default function EditPostPage() {
	const router = useRouter();
	const params = useParams();
	const { isAuthenticated, loading } = useAuth();
	const [post, setPost] = useState<BlogPost | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		content: "",
		excerpt: "",
		category_id: "",
		published: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [isAuthenticated, loading, router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const postId = params.id as string;

				// Fetch categories
				const categoriesData = await categoriesAPI.getAll();
				setCategories(categoriesData);

				// Fetch all posts to find the one we want to edit
				const posts = await postsAPI.getAll({ published: false });
				const foundPost = posts.find((p) => p.id === parseInt(postId));

				if (foundPost) {
					setPost(foundPost);
					setFormData({
						title: foundPost.title,
						slug: foundPost.slug,
						content: foundPost.content,
						excerpt: foundPost.excerpt || "",
						category_id: foundPost.category_id?.toString() || "",
						published: foundPost.published,
					});
				} else {
					setError("Post not found");
				}
			} catch (err) {
				setError("Failed to load post data");
			}
		};

		if (params.id) {
			fetchData();
		}
	}, [params.id]);

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));

		// Auto-generate slug from title
		if (name === "title") {
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
			if (!post) return;

			await postsAPI.update(post.id, {
				...formData,
				category_id: formData.category_id
					? parseInt(formData.category_id)
					: undefined,
			});
			router.push("/admin");
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to update post");
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
			<div className="max-w-4xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
						<p className="text-gray-600 mt-1">
							Update the blog post information below.
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
							<p className="text-red-800">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="title"
									className="block text-sm font-medium text-gray-700 mb-2">
									Title *
								</label>
								<input
									type="text"
									id="title"
									name="title"
									value={formData.title}
									onChange={handleInputChange}
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter post title"
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
									placeholder="post-slug"
								/>
								<p className="text-sm text-gray-500 mt-1">
									URL-friendly version of the title. Auto-generated from the
									title.
								</p>
							</div>
						</div>

						<div>
							<label
								htmlFor="excerpt"
								className="block text-sm font-medium text-gray-700 mb-2">
								Excerpt
							</label>
							<textarea
								id="excerpt"
								name="excerpt"
								value={formData.excerpt}
								onChange={handleInputChange}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Brief description of the post (optional)"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="category_id"
									className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<select
									id="category_id"
									name="category_id"
									value={formData.category_id}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
									<option value="">Select a category</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
							</div>

							<div className="flex items-center">
								<input
									type="checkbox"
									id="published"
									name="published"
									checked={formData.published}
									onChange={handleInputChange}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="published"
									className="ml-2 block text-sm text-gray-700">
									Publish this post
								</label>
							</div>
						</div>

						<div>
							<label
								htmlFor="content"
								className="block text-sm font-medium text-gray-700 mb-2">
								Content (Markdown) *
							</label>
							<textarea
								id="content"
								name="content"
								value={formData.content}
								onChange={handleInputChange}
								required
								rows={20}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
								placeholder="Write your post content in Markdown..."
							/>
							<p className="text-sm text-gray-500 mt-1">
								You can use Markdown syntax for formatting.
							</p>
						</div>

						<div className="flex items-center justify-between pt-6 border-t border-gray-200">
							<button
								type="button"
								onClick={() => router.push("/admin")}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
								{isSubmitting ? "Updating..." : "Update Post"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
