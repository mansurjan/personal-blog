"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/types";
import { categoriesAPI } from "@/lib/api";

export default function CategoriesPage() {
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
			fetchCategories();
		}
	}, [isAuthenticated]);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await categoriesAPI.getAll();
			setCategories(data);
		} catch (err) {
			setError("Failed to load categories");
			console.error("Error fetching categories:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this category?")) {
			return;
		}

		try {
			await categoriesAPI.delete(id);
			setCategories(categories.filter((category) => category.id !== id));
		} catch (err) {
			console.error("Error deleting category:", err);
			alert("Failed to delete category");
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
						<h1 className="text-xl font-bold text-gray-900">
							Manage Categories
						</h1>
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
				{/* Header Actions */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
					<Link
						href="/admin/categories/new"
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
						New Category
					</Link>
				</div>

				{/* Categories List */}
				{error ? (
					<div className="text-center py-8">
						<p className="text-red-600 mb-4">{error}</p>
						<button
							onClick={fetchCategories}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Try Again
						</button>
					</div>
				) : categories.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600 mb-4">No categories yet.</p>
						<Link
							href="/admin/categories/new"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Create Your First Category
						</Link>
					</div>
				) : (
					<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Slug
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Description
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
									{categories.map((category) => (
										<tr key={category.id}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{category.name}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{category.slug}
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-sm text-gray-500 max-w-xs truncate">
													{category.description || "No description"}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(category.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<Link
														href={`/admin/categories/${category.id}/edit`}
														className="text-blue-600 hover:text-blue-900">
														Edit
													</Link>
													<button
														onClick={() => handleDelete(category.id)}
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
					</div>
				)}
			</main>
		</div>
	);
}
