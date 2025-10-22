import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('user');
		return raw ? JSON.parse(raw) : null;
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token);
		} else {
			localStorage.removeItem('token');
		}
	}, [token]);

	useEffect(() => {
		if (user) localStorage.setItem('user', JSON.stringify(user));
		else localStorage.removeItem('user');
	}, [user]);

	const login = async (email, password) => {
		setLoading(true); setError(null);
		try {
			const res = await api.post('/auth/login', { email, password });
			setToken(res.token);
			setUser(res.user);
			return { success: true };
		} catch (e) {
			const msg = e?.message || 'Login failed';
			setError(msg);
			return { success: false, error: msg };
		} finally {
			setLoading(false);
		}
	};

	const register = async (name, email, password) => {
		setLoading(true); setError(null);
		try {
			const res = await api.post('/auth/register', { name, email, password });
			setToken(res.token);
			setUser(res.user);
			return { success: true };
		} catch (e) {
			const msg = e?.message || 'Registration failed';
			setError(msg);
			return { success: false, error: msg };
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
	};

	const value = useMemo(() => ({ token, user, loading, error, login, register, logout }), [token, user, loading, error]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
