export interface BlogPost {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	category_id?: number;
	published: boolean;
	created_at: string;
	updated_at: string;
	category?: {
		id: number;
		name: string;
		slug: string;
	};
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	created_at: string;
}

export interface User {
	id: number;
	username: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}
