"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { BlogPost } from "@/types";
import { postsAPI } from "@/lib/api";

export default function HomePage() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	useEffect(() => {
		fetchPosts();
	}, [searchQuery, selectedCategory]);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			setError(null);

			const params: any = { published: true };
			if (searchQuery) {
				params.search = searchQuery;
			}
			if (selectedCategory) {
				params.category = selectedCategory;
			}

			const data = await postsAPI.getAll(params);
			setPosts(data);
		} catch (err) {
			setError("Failed to load posts");
			console.error("Error fetching posts:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleCategoryFilter = (categorySlug: string | null) => {
		setSelectedCategory(categorySlug);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Welcome to My Blog
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Thoughts, experiences, and insights shared through words. Explore my
						latest posts and discover something new.
					</p>
				</div>

				{/* Search and Filter */}
				<SearchAndFilter
					onSearch={handleSearch}
					onCategoryFilter={handleCategoryFilter}
					selectedCategory={selectedCategory}
				/>

				{/* Posts Section */}
				<section>
					{loading ? (
						<div className="text-center py-12">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							<p className="mt-4 text-gray-600">Loading posts...</p>
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-red-600 mb-4">{error}</p>
							<button
								onClick={fetchPosts}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								Try Again
							</button>
						</div>
					) : posts.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 mb-4">
								{searchQuery || selectedCategory
									? "No posts found matching your criteria."
									: "No posts available yet."}
							</p>
							{(searchQuery || selectedCategory) && (
								<button
									onClick={() => {
										setSearchQuery("");
										setSelectedCategory(null);
									}}
									className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
									Clear Filters
								</button>
							)}
						</div>
					) : (
						<>
							<div className="mb-6">
								<h2 className="text-2xl font-semibold text-gray-900">
									{searchQuery || selectedCategory
										? "Search Results"
										: "Latest Posts"}
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
