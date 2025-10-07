"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlogPost } from "@/types";
import { postsAPI } from "@/lib/api";

export default function BlogPostPage() {
	const params = useParams();
	const slug = params.slug as string;

	const [post, setPost] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPost = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await postsAPI.getBySlug(slug);
			setPost(data);
		} catch (err) {
			setError("Post not found");
			console.error("Error fetching post:", err);
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		if (slug) {
			fetchPost();
		}
	}, [slug, fetchPost]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center py-12">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-gray-600">Loading post...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center py-12">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Post Not Found
						</h1>
						<p className="text-gray-600 mb-6">
							The post you&apos;re looking for doesn&apos;t exist or has been
							removed.
						</p>
						<Link
							href="/"
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
							Back to Home
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
						href="/"
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
						Back to Posts
					</Link>
				</div>

				{/* Post Header */}
				<header className="mb-8">
					<div className="flex items-center justify-between mb-4">
						{post.category && (
							<Link
								href={`/categories/${post.category.slug}`}
								className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
								{post.category.name}
							</Link>
						)}
						<time className="text-sm text-gray-500">
							{formatDate(post.created_at)}
						</time>
					</div>

					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{post.title}
					</h1>

					{post.excerpt && (
						<p className="text-xl text-gray-600 leading-relaxed">
							{post.excerpt}
						</p>
					)}
				</header>

				{/* Post Content */}
				<article className="prose prose-lg max-w-none">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							code({ className, children, ...props }: any) {
								const match = /language-(\w+)/.exec(className || "");
								const inline = !match;
								return !inline && match ? (
									<SyntaxHighlighter
										style={tomorrow}
										language={match[1]}
										PreTag="div"
										{...props}>
										{String(children).replace(/\n$/, "")}
									</SyntaxHighlighter>
								) : (
									<code className={className} {...props}>
										{children}
									</code>
								);
							},
						}}>
						{post.content}
					</ReactMarkdown>
				</article>

				{/* Post Footer */}
				<footer className="mt-12 pt-8 border-t border-gray-200">
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-500">
							Published on {formatDate(post.created_at)}
							{post.updated_at !== post.created_at && (
								<span> • Updated on {formatDate(post.updated_at)}</span>
							)}
						</div>

						<Link
							href="/"
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
							Back to Posts
						</Link>
					</div>
				</footer>
			</main>

			<Footer />
		</div>
	);
}
