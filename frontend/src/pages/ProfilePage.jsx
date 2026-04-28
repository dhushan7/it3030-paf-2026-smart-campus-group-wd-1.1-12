import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Ticket, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../api/ticketService';
import { StatusBadge } from '../components/tickets/StatusBadge';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ticketService.getAll()
            .then(setTickets)
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        total:      tickets.length,
        open:       tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved:   tickets.filter(t => t.status === 'RESOLVED').length,
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>

            {/* User Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center gap-6">
                {user?.picture ? (
                    <img src={user.picture} alt={user.name}
                         className="h-20 w-20 rounded-full border-2 border-purple-500/40 object-cover" />
                ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600
                                    flex items-center justify-center text-3xl font-bold text-white">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                )}
                <div className="space-y-1.5">
                    <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Mail size={14} /> {user?.email}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Shield size={14} />
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${user?.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' :
                              user?.role === 'TECHNICIAN' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-gray-500/20 text-gray-300'}`}>
                            {user?.role}
                        </span>
                    </p>
                </div>
            </div>

            {/* Ticket Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total',       value: stats.total,      color: 'text-purple-400' },
                    { label: 'Open',        value: stats.open,       color: 'text-blue-400' },
                    { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400' },
                    { label: 'Resolved',    value: stats.resolved,   color: 'text-green-400' },
                ].map(s => (
                    <div key={s.label}
                         className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Ticket History */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        <Ticket size={16} className="text-purple-400" /> Ticket History
                    </h2>
                </div>
                {loading ? (
                    <div className="py-10 flex justify-center">
                        <div className="h-6 w-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    </div>
                ) : tickets.length === 0 ? (
                    <p className="text-center text-gray-600 py-10 text-sm">No tickets yet</p>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {tickets.map(t => (
                            <li key={t.id}>
                                <Link to={`/tickets/${t.id}`}
                                      className="flex items-center justify-between px-5 py-3.5
                                                 hover:bg-white/5 transition group">
                                    <div className="min-w-0">
                                        <p className="text-sm text-white group-hover:text-purple-300
                                                       transition truncate">{t.title}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <Clock size={10} />
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <StatusBadge status={t.status} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.div>
    );
}
