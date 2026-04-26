import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Ticket, CheckCircle, XCircle, Clock, AlertCircle, BarChart3
} from 'lucide-react';
import { userService } from '../api/userService';
import { ticketService } from '../api/ticketService';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </div>
    </div>
);

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers]         = useState([]);
    const [tickets, setTickets]     = useState([]);
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        Promise.all([
            userService.getAnalytics(),
            userService.getAll(),
            ticketService.getAll(),
        ]).then(([a, u, t]) => {
            setAnalytics(a);
            setUsers(u);
            setTickets(t.slice(0, 10)); // recent 10
        }).finally(() => setLoading(false));
    }, []);

    const changeRole = async (userId, role) => {
        await userService.updateRole(userId, role);
        const updated = await userService.getAll();
        setUsers(updated);
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

            {/* Stats Grid */}
            {analytics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Ticket}      label="Total Tickets"  value={analytics.totalTickets}  color="bg-purple-600" />
                    <StatCard icon={AlertCircle} label="Open"           value={analytics.openTickets}   color="bg-blue-600" />
                    <StatCard icon={Clock}       label="In Progress"    value={analytics.inProgress}    color="bg-yellow-600" />
                    <StatCard icon={CheckCircle} label="Resolved"       value={analytics.resolved}      color="bg-green-600" />
                    <StatCard icon={XCircle}     label="Rejected"       value={analytics.rejected}      color="bg-red-600" />
                    <StatCard icon={CheckCircle} label="Closed"         value={analytics.closed}        color="bg-gray-600" />
                    <StatCard icon={Users}       label="Total Users"    value={analytics.totalUsers}    color="bg-indigo-600" />
                    <StatCard icon={BarChart3}   label="Resolution Rate"
                              value={analytics.totalTickets
                                  ? Math.round((analytics.resolved / analytics.totalTickets) * 100) + '%'
                                  : 'N/A'}
                              color="bg-teal-600" />
                </div>
            )}

            {/* Recent Tickets */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="font-semibold text-white">Recent Tickets</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 text-xs border-b border-white/10">
                                <th className="px-6 py-3">Title</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Priority</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tickets.map(t => (
                                <tr key={t.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-3 text-white max-w-[200px] truncate">{t.title}</td>
                                    <td className="px-4 py-3 text-gray-400">{t.category}</td>
                                    <td className="px-4 py-3 text-gray-400">{t.priority}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                            ${t.status === 'OPEN' ? 'bg-blue-500/20 text-blue-300' :
                                              t.status === 'RESOLVED' ? 'bg-green-500/20 text-green-300' :
                                              t.status === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                                              'bg-yellow-500/20 text-yellow-300'}`}>
                                            {t.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Management */}
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="font-semibold text-white">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 text-xs border-b border-white/10">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Change Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-3 text-white">{u.name}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                            ${u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' :
                                              u.role === 'TECHNICIAN' ? 'bg-blue-500/20 text-blue-300' :
                                              'bg-gray-500/20 text-gray-300'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            defaultValue={u.role}
                                            onChange={e => changeRole(u.id, e.target.value)}
                                            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1
                                                       text-xs text-white focus:outline-none focus:border-purple-500">
                                            <option value="USER">USER</option>
                                            <option value="TECHNICIAN">TECHNICIAN</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
