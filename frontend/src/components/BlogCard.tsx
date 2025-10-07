import Link from "next/link";
import { BlogPost } from "@/types";

interface BlogCardProps {
	post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<article className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
			<div className="p-6">
				<div className="flex items-center justify-between mb-3">
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

				<h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-gray-700 transition-colors">
					<Link href={`/posts/${post.slug}`}>{post.title}</Link>
				</h2>

				{post.excerpt && (
					<p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
				)}

				<Link
					href={`/posts/${post.slug}`}
					className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
					Read more
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
				</Link>
			</div>
		</article>
	);
}
