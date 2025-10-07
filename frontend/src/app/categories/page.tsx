"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Category } from "@/types";
import { categoriesAPI } from "@/lib/api";

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchCategories();
	}, []);

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

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Categories</h1>
					<p className="text-lg text-gray-600">
						Explore posts by category to find content that interests you.
					</p>
				</div>

				{/* Categories Grid */}
				{loading ? (
					<div className="text-center py-12">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-gray-600">Loading categories...</p>
					</div>
				) : error ? (
					<div className="text-center py-12">
						<p className="text-red-600 mb-4">{error}</p>
						<button
							onClick={fetchCategories}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Try Again
						</button>
					</div>
				) : categories.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-600">No categories available yet.</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/categories/${category.slug}`}
								className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group">
								<h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
									{category.name}
								</h3>
								{category.description && (
									<p className="text-gray-600 leading-relaxed">
										{category.description}
									</p>
								)}
								<div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
									<span className="text-sm font-medium">View Posts</span>
									<svg
										className="ml-1 w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</Link>
						))}
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
