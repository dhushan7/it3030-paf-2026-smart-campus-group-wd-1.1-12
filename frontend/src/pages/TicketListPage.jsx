import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ticketService } from '../api/ticketService';
import TicketCard from '../components/tickets/TicketCard';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

export default function TicketListPage() {
    // Extracted isAdmin alongside isTechnician to handle role-based titles
    const { isAdmin, isTechnician } = useAuth();
    const [tickets, setTickets]       = useState([]);
    const [filtered, setFiltered]     = useState([]);
    const [search, setSearch]         = useState('');
    const [status, setStatus]         = useState('ALL');
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        setLoading(true);
        
        ticketService.getAll()
            .then(data => { 
                setTickets(data); 
                setFiltered(data); 
            })
            .catch(error => {
                console.error("Error loading tickets:", error);
                setTickets([]);
                setFiltered([]);
            })
            .finally(() => setLoading(false));
    }, []); 

    useEffect(() => {
        let result = tickets;
        if (status !== 'ALL') result = result.filter(t => t.status === status);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(t =>
                t.title?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.category?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [tickets, search, status]);

    // Determine header title based on user role
    const getPageTitle = () => {
        if (isAdmin) return 'All Company Tickets';
        if (isTechnician) return 'Assigned Tickets';
        return 'My Tickets';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {getPageTitle()}
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        {filtered.length} ticket{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <Link to="/tickets/new"
                      className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500">
                    <Plus size={16} /> New Ticket
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        className="w-full rounded-xl border border-white/20 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
                        placeholder="Search tickets…"
                        value={search}
                        onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {STATUSES.map(s => (
                        <button key={s}
                                onClick={() => setStatus(s)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition
                                            ${status === s
                                                ? 'bg-purple-600 text-white'
                                                : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                    <p className="mb-3 text-4xl">📋</p>
                    <p>No tickets found</p>
                </div>
            ) : (
                <motion.div
                    initial="hidden" animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                    className="grid gap-4">
                    {filtered.map(t => (
                        <motion.div key={t.id}
                            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                            <TicketCard ticket={t} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}