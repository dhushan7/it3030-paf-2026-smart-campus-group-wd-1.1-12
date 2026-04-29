
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, register, loginWithGoogle, loading } = useAuth();

    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showPass, setShow] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const change = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (mode === 'login') {
                await login({
                    email: form.email,
                    password: form.password,
                });
            } else {
                await register(form);
            }

            navigate('/tickets');
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    err.message ??
                    'Authentication failed'
            );
        }
    };

    // ✅ DEMO LOGIN FUNCTION
    const demoLogin = async (role) => {
        setError('');

        let credentials = {};

        switch (role) {
            case 'admin':
                credentials = {
                    email: 'admin@smartcampus.lk',
                    password: 'Admin@123',
                };
                break;

            case 'technician':
                credentials = {
                    email: 'tech@smartcampus.lk',
                    password: 'Tech@123',
                };
                break;

            case 'user':
                credentials = {
                    email: 'student@smartcampus.lk',
                    password: 'Student@123',
                };
                break;

            default:
                return;
        }

        try {
            await login(credentials);
            navigate('/tickets');
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    err.message ??
                    'Demo login failed'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5
                           backdrop-blur-xl p-8 shadow-2xl"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        Smart Campus
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {mode === 'login'
                            ? 'Sign in to your account'
                            : 'Create a new account'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">
                                Full Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={change}
                                required
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                placeholder="Your name"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={change}
                            required
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            placeholder="you@email.com"
                        />
                    </div>

                    <div className="relative">
                        <label className="text-xs text-gray-400 mb-1 block">
                            Password
                        </label>
                        <input
                            type={showPass ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            onChange={change}
                            required
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShow((s) => !s)}
                            className="absolute right-3 top-7 text-gray-500 hover:text-gray-300"
                        >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-medium text-sm transition flex items-center justify-center gap-2"
                    >
                        {mode === 'login' ? (
                            <>
                                <LogIn size={16} /> Sign In
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} /> Register
                            </>
                        )}
                    </button>
                </form>

                {/* OR divider */}
                <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-gray-600">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Google Login */}
                <button
                    onClick={loginWithGoogle}
                    className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5
                            hover:bg-white/10 text-sm text-white transition
                            backdrop-blur-md flex items-center justify-center gap-3"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                {/* DEMO LOGIN BUTTONS */}
                <div className="mt-4 space-y-2">

                    <button
                        type="button"
                        onClick={() => demoLogin('admin')}
                        className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5
                                hover:bg-white/10 text-sm text-white transition
                                backdrop-blur-md flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Demo Login as Admin
                    </button>

                    <button
                        type="button"
                        onClick={() => demoLogin('technician')}
                        className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5
                                hover:bg-white/10 text-sm text-white transition
                                backdrop-blur-md flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Demo Login as Technician
                    </button>

                    <button
                        type="button"
                        onClick={() => demoLogin('user')}
                        className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5
                                hover:bg-white/10 text-sm text-white transition
                                backdrop-blur-md flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Demo Login as User
                    </button>

                </div>

                <p className="mt-4 text-center text-xs text-gray-500">
                    {mode === 'login' ? (
                        <>
                            No account?{' '}
                            <button
                                onClick={() => setMode('register')}
                                className="text-purple-400 hover:underline"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            Have an account?{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="text-purple-400 hover:underline"
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </p>
            </motion.div>
        </div>
    );
}
