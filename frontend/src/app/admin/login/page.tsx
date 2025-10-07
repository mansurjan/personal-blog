"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const { login, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/admin");
		}
	}, [isAuthenticated, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await login(username, password);
			router.push("/admin");
		} catch (err: any) {
			setError(err.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
					Admin Login
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Sign in to access the admin panel
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
								{error}
							</div>
						)}

						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700">
								Username
							</label>
							<div className="mt-1">
								<input
									id="username"
									name="username"
									type="text"
									required
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your username"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your password"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
								{loading ? (
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Signing in...
									</div>
								) : (
									"Sign in"
								)}
							</button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Default Credentials
								</span>
							</div>
						</div>
						<div className="mt-4 text-center text-sm text-gray-600">
							<p>
								Username:{" "}
								<code className="bg-gray-100 px-1 rounded">admin</code>
							</p>
							<p>
								Password:{" "}
								<code className="bg-gray-100 px-1 rounded">admin123</code>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
