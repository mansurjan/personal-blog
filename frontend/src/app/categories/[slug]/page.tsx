"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Category, BlogPost } from "@/types";
import { categoriesAPI, postsAPI } from "@/lib/api";

export default function CategoryPage() {
	const params = useParams();
	const slug = params.slug as string;

	const [category, setCategory] = useState<Category | null>(null);
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCategoryAndPosts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const [categoryData, postsData] = await Promise.all([
				categoriesAPI.getBySlug(slug),
				postsAPI.getAll({ category: slug, published: true }),
			]);

			setCategory(categoryData);
			setPosts(postsData);
		} catch (err) {
			setError("Category not found");
			console.error("Error fetching category:", err);
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		if (slug) {
			fetchCategoryAndPosts();
		}
	}, [slug, fetchCategoryAndPosts]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center py-12">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-gray-600">Loading category...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (error || !category) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center py-12">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Category Not Found
						</h1>
						<p className="text-gray-600 mb-6">
							The category you&apos;re looking for doesn&apos;t exist.
						</p>
						<Link
							href="/categories"
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
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to Categories
						</Link>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Back Button */}
				<div className="mb-6">
					<Link
						href="/categories"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
						<svg
							className="mr-2 w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Categories
					</Link>
				</div>

				{/* Category Header */}
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{category.name}
					</h1>
					{category.description && (
						<p className="text-xl text-gray-600 leading-relaxed">
							{category.description}
						</p>
					)}
				</header>

				{/* Posts Section */}
				<section>
					{posts.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 mb-4">
								No posts found in this category yet.
							</p>
							<Link
								href="/"
								className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								View All Posts
							</Link>
						</div>
					) : (
						<>
							<div className="mb-6">
								<h2 className="text-2xl font-semibold text-gray-900">
									Posts in {category.name}
								</h2>
								<p className="text-gray-600 mt-1">
									{posts.length} {posts.length === 1 ? "post" : "posts"} found
								</p>
							</div>

							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
								{posts.map((post) => (
									<BlogCard key={post.id} post={post} />
								))}
							</div>
						</>
					)}
				</section>
			</main>

			<Footer />
		</div>
	);
}
