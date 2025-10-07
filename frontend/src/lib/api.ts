import axios from "axios";
import { BlogPost, Category, AuthResponse } from "@/types";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add auth token to requests
api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// Auth API
export const authAPI = {
	login: async (username: string, password: string): Promise<AuthResponse> => {
		const response = await api.post("/auth/login", { username, password });
		return response.data;
	},

	verify: async (): Promise<{ valid: boolean; user: any }> => {
		const response = await api.post("/auth/verify");
		return response.data;
	},
};

// Posts API
export const postsAPI = {
	getAll: async (params?: {
		category?: string;
		search?: string;
		published?: boolean;
	}): Promise<BlogPost[]> => {
		const response = await api.get("/posts", { params });
		return response.data;
	},

	getBySlug: async (slug: string): Promise<BlogPost> => {
		const response = await api.get(`/posts/${slug}`);
		return response.data;
	},

	create: async (post: Partial<BlogPost>): Promise<BlogPost> => {
		const response = await api.post("/posts", post);
		return response.data;
	},

	update: async (id: number, post: Partial<BlogPost>): Promise<BlogPost> => {
		const response = await api.put(`/posts/${id}`, post);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await api.delete(`/posts/${id}`);
	},
};

// Categories API
export const categoriesAPI = {
	getAll: async (): Promise<Category[]> => {
		const response = await api.get("/categories");
		return response.data;
	},

	getBySlug: async (slug: string): Promise<Category> => {
		const response = await api.get(`/categories/${slug}`);
		return response.data;
	},

	create: async (category: Partial<Category>): Promise<Category> => {
		const response = await api.post("/categories", category);
		return response.data;
	},

	update: async (
		id: number,
		category: Partial<Category>
	): Promise<Category> => {
		const response = await api.put(`/categories/${id}`, category);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await api.delete(`/categories/${id}`);
	},
};

export default api;
