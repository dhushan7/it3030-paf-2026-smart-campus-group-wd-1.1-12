import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Ticket,
    Clock,
    CheckCircle,
    AlertCircle,
    Wrench,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Reusable glowing stat card tailored for the tech view
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1 group">
        <div className={`p-3 rounded-xl transition-colors ${color} group-hover:bg-opacity-80`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-white tracking-wide">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-wider uppercase">{label}</p>
        </div>
    </div>
);

export default function TechDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [activeTickets, setActiveTickets] = useState([]);
    const [maintenanceTasks, setMaintenanceTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with your actual technician-specific API endpoints
        const fetchTechData = async () => {
            try {
                // Simulating API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock Data - Replace with actual fetch calls
                setStats({
                    assigned: 12,
                    inProgress: 5,
                    resolvedToday: 3,
                    pendingMaintenance: 4
                });

                setActiveTickets([
                    { id: 'TKT-082', title: 'Network Switch Failure', priority: 'HIGH', status: 'IN_PROGRESS', time: '2 hours ago' },
                    { id: 'TKT-085', title: 'Projector not connecting', priority: 'MEDIUM', status: 'OPEN', time: '4 hours ago' },
                    { id: 'TKT-088', title: 'Software License Expired', priority: 'LOW', status: 'OPEN', time: '1 day ago' },
                ]);

                setMaintenanceTasks([
                    { id: 'MT-01', equip: 'Server Rack A AC Unit', date: 'Today, 2:00 PM', status: 'DUE' },
                    { id: 'MT-02', equip: 'Lab Computers Update', date: 'Tomorrow, 9:00 AM', status: 'UPCOMING' },
                ]);
            } catch (error) {
                console.error("Failed to load tech dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTechData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="h-10 w-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0] || 'Tech'}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Here is your workspace overview and current queue.
                </p>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Ticket} label="Assigned Tickets" value={stats.assigned} color="bg-indigo-600/80" />
                    <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="bg-yellow-600/80" />
                    <StatCard icon={CheckCircle} label="Resolved Today" value={stats.resolvedToday} color="bg-green-600/80" />
                    <StatCard icon={Wrench} label="Pending Maintenance" value={stats.pendingMaintenance} color="bg-blue-600/80" />
                </div>
            )}

            {/* Main Content Grid: 2 Columns on Large Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Tickets Section (Takes up 2 columns) */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-xl flex flex-col">
                    <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <AlertCircle size={18} className="text-indigo-400" />
                            My Active Queue
                        </h2>
                        <Link to="/tech/tickets" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-3 flex-grow">
                        {activeTickets.length > 0 ? (
                            activeTickets.map(ticket => (
                                <div key={ticket.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition duration-200 group cursor-pointer">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                                            <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border
                                                ${ticket.priority === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                                  ticket.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                  'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <h3 className="text-gray-200 font-medium group-hover:text-white transition-colors">{ticket.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Clock size={12} /> {ticket.time}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border
                                            ${ticket.status === 'IN_PROGRESS' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 
                                              'bg-white/5 text-gray-400 border-white/10'}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No active tickets. You're all caught up!
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Maintenance Section (Takes up 1 column) */}
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-xl flex flex-col">
                    <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Calendar size={18} className="text-blue-400" />
                            Maintenance
                        </h2>
                        <Link to="/tech/tickets-maintain" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Schedule
                        </Link>
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-grow">
                        {maintenanceTasks.length > 0 ? (
                            maintenanceTasks.map(task => (
                                <div key={task.id} className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 hover:bg-blue-500/10 transition duration-200 cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-sm font-medium text-gray-200">{task.equip}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                                            ${task.status === 'DUE' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <Clock size={12} className="text-gray-500" /> {task.date}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm flex flex-col items-center">
                                <CheckCircle size={24} className="mb-2 text-gray-600" />
                                No upcoming maintenance tasks.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}