"use client";

import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { User } from "@/types";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
	loading: boolean;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") {
			setLoading(false);
			return;
		}

		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
			// Verify token on app load
			authAPI
				.verify()
				.then((response) => {
					if (response.valid) {
						setUser(response.user);
					} else {
						localStorage.removeItem("token");
						setToken(null);
					}
				})
				.catch(() => {
					localStorage.removeItem("token");
					setToken(null);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (username: string, password: string) => {
		try {
			const response = await authAPI.login(username, password);
			setUser(response.user);
			setToken(response.token);
			if (typeof window !== "undefined") {
				localStorage.setItem("token", response.token);
			}
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
		}
	};

	const value = {
		user,
		token,
		login,
		logout,
		loading,
		isAuthenticated: !!user && !!token,
	};

	return React.createElement(AuthContext.Provider, { value }, children);
};
