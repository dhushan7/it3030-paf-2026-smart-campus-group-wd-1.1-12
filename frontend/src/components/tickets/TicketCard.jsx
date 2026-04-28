import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Clock } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';

export default function TicketCard({ ticket }) {
    const date = new Date(ticket.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <Link to={`/tickets/${ticket.id}`}
              className="block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10
                         p-5 transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg
                         hover:shadow-purple-900/20 group">
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition line-clamp-1">
                    {ticket.title}
                </h3>
                <StatusBadge status={ticket.status} />
            </div>

            <p className="mt-2 text-sm text-gray-400 line-clamp-2">{ticket.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {ticket.resourceLocation && (
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {ticket.resourceLocation}
                    </span>
                )}
                {ticket.category && (
                    <span className="flex items-center gap-1">
                        <Tag size={12} /> {ticket.category}
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <Clock size={12} /> {date}
                </span>
                <PriorityBadge priority={ticket.priority} />
            </div>
        </Link>
    );
}
