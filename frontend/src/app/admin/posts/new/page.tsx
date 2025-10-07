"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/types";
import { categoriesAPI, postsAPI } from "@/lib/api";

export default function NewPostPage() {
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [content, setContent] = useState("");
	const [excerpt, setExcerpt] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [published, setPublished] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { isAuthenticated, loading: authLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [isAuthenticated, authLoading, router]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchCategories();
		}
	}, [isAuthenticated]);

	const fetchCategories = async () => {
		try {
			const data = await categoriesAPI.getAll();
			setCategories(data);
		} catch (err) {
			console.error("Error fetching categories:", err);
		}
	};

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9 -]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		if (!slug || slug === generateSlug(title)) {
			setSlug(generateSlug(newTitle));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const postData = {
				title,
				slug,
				content,
				excerpt,
				category_id: categoryId ? parseInt(categoryId) : undefined,
				published,
			};

			await postsAPI.create(postData);
			router.push("/admin");
		} catch (err: unknown) {
			const error = err as { response?: { data?: { error?: string } } };
			setError(error.response?.data?.error || "Failed to create post");
		} finally {
			setLoading(false);
		}
	};

	if (authLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Admin Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-xl font-bold text-gray-900">New Post</h1>
						<div className="flex items-center space-x-4">
							<Link
								href="/admin"
								className="text-gray-600 hover:text-gray-900 transition-colors">
								Back to Dashboard
							</Link>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
							{error}
						</div>
					)}

					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Post Details
						</h2>

						<div className="space-y-4">
							<div>
								<label
									htmlFor="title"
									className="block text-sm font-medium text-gray-700 mb-2">
									Title *
								</label>
								<input
									type="text"
									id="title"
									value={title}
									onChange={handleTitleChange}
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
									value={slug}
									onChange={(e) => setSlug(e.target.value)}
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="post-url-slug"
								/>
								<p className="mt-1 text-sm text-gray-500">URL: /posts/{slug}</p>
							</div>

							<div>
								<label
									htmlFor="excerpt"
									className="block text-sm font-medium text-gray-700 mb-2">
									Excerpt
								</label>
								<textarea
									id="excerpt"
									value={excerpt}
									onChange={(e) => setExcerpt(e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Brief description of the post"
								/>
							</div>

							<div>
								<label
									htmlFor="category"
									className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<select
									id="category"
									value={categoryId}
									onChange={(e) => setCategoryId(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
									checked={published}
									onChange={(e) => setPublished(e.target.checked)}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="published"
									className="ml-2 block text-sm text-gray-700">
									Publish immediately
								</label>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Content
						</h2>
						<div>
							<label
								htmlFor="content"
								className="block text-sm font-medium text-gray-700 mb-2">
								Content * (Markdown)
							</label>
							<textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
								rows={20}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
								placeholder="Write your post content in Markdown..."
							/>
							<p className="mt-1 text-sm text-gray-500">
								You can use Markdown syntax for formatting. Preview will be
								shown on the frontend.
							</p>
						</div>
					</div>

					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={() => router.push("/admin")}
							className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
							{loading ? "Creating..." : "Create Post"}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}
