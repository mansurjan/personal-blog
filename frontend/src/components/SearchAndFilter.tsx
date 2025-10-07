"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { categoriesAPI } from "@/lib/api";

interface SearchAndFilterProps {
	onSearch: (query: string) => void;
	onCategoryFilter: (categorySlug: string | null) => void;
	selectedCategory?: string | null;
}

export default function SearchAndFilter({
	onSearch,
	onCategoryFilter,
	selectedCategory,
}: SearchAndFilterProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await categoriesAPI.getAll();
				setCategories(data);
			} catch (error) {
				console.error("Error fetching categories:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value;
		setSearchQuery(query);
		onSearch(query);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const categorySlug = e.target.value || null;
		onCategoryFilter(categorySlug);
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Search Input */}
				<div className="flex-1">
					<label
						htmlFor="search"
						className="block text-sm font-medium text-gray-700 mb-2">
						Search Posts
					</label>
					<div className="relative">
						<input
							type="text"
							id="search"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search for posts..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<svg
							className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>

				{/* Category Filter */}
				<div className="sm:w-64">
					<label
						htmlFor="category"
						className="block text-sm font-medium text-gray-700 mb-2">
						Filter by Category
					</label>
					<select
						id="category"
						value={selectedCategory || ""}
						onChange={handleCategoryChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						disabled={loading}>
						<option value="">All Categories</option>
						{categories.map((category) => (
							<option key={category.id} value={category.slug}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
