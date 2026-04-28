import React, { createContext, useContext, useState } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    // ✅ Normalize role safely
    const normalizeRole = (role) => {
        if (!role) return null;
        return role.replace("ROLE_", "").toUpperCase().trim();
    };

    // ✅ Persist auth data (handles different response shapes)
    const persistAuth = (authData) => {
        // 🔥 Support both:
        // { token, user: {...} }  OR  { token, id, name, role }
        const data = authData.user ? authData.user : authData;

        const normalizedRole = normalizeRole(data.role);

        const userObj = {
            id:      data.id,
            name:    data.name,
            email:   data.email,
            role:    normalizedRole,
            picture: data.picture ?? null,
        };

        // 🧪 DEBUG
        console.log("Raw Auth Data:", authData);
        console.log("Processed User:", userObj);

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(userObj));

        setToken(authData.token);
        setUser(userObj);
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            persistAuth(data);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.register(credentials);
            persistAuth(data);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = () => authService.googleLogin();

    /** OAuth2 callback handler */
    const loginWithToken = (rawToken) => {
        try {
            const payload = JSON.parse(atob(rawToken.split('.')[1]));

            persistAuth({
                token: rawToken,
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                role: payload.role,
                picture: payload.picture ?? null,
            });
        } catch (err) {
            console.error('Failed to decode token', err);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token && user);
    const isAdmin = user?.role === 'ADMIN';
    const isTechnician = user?.role === 'TECHNICIAN';

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                loginWithGoogle,
                loginWithToken,
                logout,
                isAuthenticated,
                isAdmin,
                isTechnician,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}