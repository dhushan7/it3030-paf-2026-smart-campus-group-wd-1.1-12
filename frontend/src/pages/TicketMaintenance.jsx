import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ticketService } from '../api/ticketService';
import TicketCard from '../components/tickets/TicketCard';
import { Wrench } from 'lucide-react'; // A nice icon for maintenance

export default function TicketMaintenance() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        ticketService.getAll()
            .then(data => {
                // Filter immediately to only keep OPEN and IN_PROGRESS tickets
                const activeTickets = data.filter(t => 
                    t.status === 'OPEN' || t.status === 'IN_PROGRESS'
                );
                setTickets(activeTickets);
            })
            .catch(error => {
                console.error("Error loading maintenance tickets:", error);
                setTickets([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="rounded-xl bg-yellow-500/20 p-2 text-yellow-400">
                            <Wrench size={24} />
                        </div>
                        Active Maintenance
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} requiring attention
                    </p>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
                </div>
            ) : tickets.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                    <p className="mb-3 text-4xl">🎉</p>
                    <p>All caught up! No active maintenance tickets.</p>
                </div>
            ) : (
                <motion.div
                    initial="hidden" animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                    className="grid gap-4">
                    {tickets.map(t => (
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