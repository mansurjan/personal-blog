"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
	const { isAuthenticated, logout } = useAuth();

	return (
		<header className="bg-white border-b border-gray-200">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link
						href="/"
						className="text-xl font-bold text-gray-900 hover:text-gray-700">
						Personal Blog
					</Link>

					<nav className="flex items-center space-x-6">
						<Link
							href="/"
							className="text-gray-600 hover:text-gray-900 transition-colors">
							Home
						</Link>
						<Link
							href="/categories"
							className="text-gray-600 hover:text-gray-900 transition-colors">
							Categories
						</Link>

						{isAuthenticated ? (
							<>
								<Link
									href="/admin"
									className="text-gray-600 hover:text-gray-900 transition-colors">
									Admin
								</Link>
								<button
									onClick={logout}
									className="text-gray-600 hover:text-gray-900 transition-colors">
									Logout
								</button>
							</>
						) : (
							<Link
								href="/admin/login"
								className="text-gray-600 hover:text-gray-900 transition-colors">
								Admin
							</Link>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
