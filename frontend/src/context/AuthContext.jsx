import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]   = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')); }
        catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    const persistAuth = (authData) => {
        localStorage.setItem('token', authData.token);
        const userObj = {
            id:      authData.id,
            name:    authData.name,
            email:   authData.email,
            role:    authData.role,
            picture: authData.picture,
        };
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

    /** Called from OAuth2CallbackPage after Google redirect */
    const loginWithToken = (rawToken) => {
        // Decode payload to extract user info
        try {
            const payload = JSON.parse(atob(rawToken.split('.')[1]));
            persistAuth({
                token:   rawToken,
                id:      payload.sub,
                name:    payload.name,
                email:   payload.email,
                role:    payload.role,
                picture: payload.picture ?? null,
            });
        } catch {
            console.error('Failed to decode token');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token && user);
    const isAdmin        = user?.role === 'ADMIN';
    const isTechnician   = user?.role === 'TECHNICIAN';

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, register, loginWithGoogle, loginWithToken, logout,
            isAuthenticated, isAdmin, isTechnician,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
