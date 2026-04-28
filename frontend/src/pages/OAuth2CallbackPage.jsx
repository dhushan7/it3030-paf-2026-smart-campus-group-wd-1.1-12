import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuth2CallbackPage() {
    const [params]  = useSearchParams();
    const navigate  = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = params.get('token');
        if (token) {
            loginWithToken(token);
            navigate('/tickets', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="h-8 w-8 rounded-full border-4 border-purple-500 border-t-transparent
                                animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Completing sign-in…</p>
            </div>
        </div>
    );
}
