"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BlogPost, Category } from "@/types";
import { postsAPI, categoriesAPI } from "@/lib/api";

export default function AdminDashboard() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { isAuthenticated, loading: authLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [isAuthenticated, authLoading, router]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchData();
		}
	}, [isAuthenticated]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [postsData, categoriesData] = await Promise.all([
				postsAPI.getAll({ published: false }), // Get all posts including drafts
				categoriesAPI.getAll(),
			]);

			setPosts(postsData);
			setCategories(categoriesData);
		} catch (err) {
			setError("Failed to load data");
			console.error("Error fetching data:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeletePost = async (id: number) => {
		if (!confirm("Are you sure you want to delete this post?")) {
			return;
		}

		try {
			await postsAPI.delete(id);
			setPosts(posts.filter((post) => post.id !== id));
		} catch (err) {
			console.error("Error deleting post:", err);
			alert("Failed to delete post");
		}
	};

	const handleTogglePublish = async (post: BlogPost) => {
		try {
			const updatedPost = await postsAPI.update(post.id, {
				...post,
				published: !post.published,
			});

			setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));
		} catch (err) {
			console.error("Error updating post:", err);
			alert("Failed to update post");
		}
	};

	if (authLoading || loading) {
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
						<h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
						<div className="flex items-center space-x-4">
							<Link
								href="/"
								className="text-gray-600 hover:text-gray-900 transition-colors">
								View Site
							</Link>
							<button
								onClick={() => router.push("/admin/login")}
								className="text-gray-600 hover:text-gray-900 transition-colors">
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Total Posts
						</h3>
						<p className="text-3xl font-bold text-blue-600">{posts.length}</p>
					</div>
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Published Posts
						</h3>
						<p className="text-3xl font-bold text-green-600">
							{posts.filter((post) => post.published).length}
						</p>
					</div>
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Categories
						</h3>
						<p className="text-3xl font-bold text-purple-600">
							{categories.length}
						</p>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Quick Actions
					</h2>
					<div className="flex flex-wrap gap-4">
						<Link
							href="/admin/posts/new"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							<svg
								className="mr-2 w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							New Post
						</Link>
						<Link
							href="/admin/categories/new"
							className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
							<svg
								className="mr-2 w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							New Category
						</Link>
						<Link
							href="/admin/posts"
							className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
							<svg
								className="mr-2 w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							Manage Posts
						</Link>
						<Link
							href="/admin/categories"
							className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
							<svg
								className="mr-2 w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
							Manage Categories
						</Link>
					</div>
				</div>

				{/* Recent Posts */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Recent Posts
					</h2>

					{error ? (
						<div className="text-center py-8">
							<p className="text-red-600 mb-4">{error}</p>
							<button
								onClick={fetchData}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								Try Again
							</button>
						</div>
					) : posts.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-600 mb-4">No posts yet.</p>
							<Link
								href="/admin/posts/new"
								className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								Create Your First Post
							</Link>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Title
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Category
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Created
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{posts.slice(0, 10).map((post) => (
										<tr key={post.id}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{post.title}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{post.category?.name || "Uncategorized"}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
														post.published
															? "bg-green-100 text-green-800"
															: "bg-yellow-100 text-yellow-800"
													}`}>
													{post.published ? "Published" : "Draft"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(post.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<Link
														href={`/admin/posts/${post.id}/edit`}
														className="text-blue-600 hover:text-blue-900">
														Edit
													</Link>
													<button
														onClick={() => handleTogglePublish(post)}
														className="text-green-600 hover:text-green-900">
														{post.published ? "Unpublish" : "Publish"}
													</button>
													<button
														onClick={() => handleDeletePost(post.id)}
														className="text-red-600 hover:text-red-900">
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
