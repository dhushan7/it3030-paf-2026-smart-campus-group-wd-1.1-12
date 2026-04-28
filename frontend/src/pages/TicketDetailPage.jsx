import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Paperclip, Save } from 'lucide-react';
import { ticketService } from '../api/ticketService';
import { userService } from '../api/userService';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/tickets/StatusBadge';
import CommentSection from '../components/tickets/CommentSection';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

export default function TicketDetailPage() {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const { user, isAdmin, isTechnician } = useAuth();

    const [ticket, setTicket]           = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [updating, setUpdating]       = useState(false);
    const [statusForm, setStatusForm]   = useState({
        status: '', resolutionNotes: '', assignedTechnicianId: '',
    });

    const load = async () => {
        const data = await ticketService.getById(id);
        setTicket(data);
        setStatusForm({
            status: data.status,
            resolutionNotes: data.resolutionNotes ?? '',
            assignedTechnicianId: data.assignedTechnicianId ?? '',
        });
        setLoading(false);
    };

    useEffect(() => {
        load();
        if (isAdmin || isTechnician) {
            userService.getTechnicians().then(setTechnicians).catch(() => {});
        }
    }, [id]);

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await ticketService.updateStatus(id, statusForm);
            await load();
        } finally { setUpdating(false); }
    };

    const canManage = isAdmin || isTechnician;

    const selectClass = `w-full rounded-xl border border-white/20 bg-gray-900 px-3 py-2.5
                         text-sm text-white focus:outline-none focus:border-purple-500
                         [&>option]:bg-gray-900 [&>option]:text-white`;

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="h-8 w-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        </div>
    );

    if (!ticket) return (
        <div className="text-center py-20 text-gray-500">Ticket not found</div>
    );

    const created = new Date(ticket.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium', timeStyle: 'short',
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
            {/* Back */}
            <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                <ArrowLeft size={16} /> Back
            </button>

            {/* Ticket Header */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-white flex-1">{ticket.title}</h1>
                    <StatusBadge status={ticket.status} />
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {ticket.category && <span>Category: <b className="text-gray-300">{ticket.category}</b></span>}
                    {ticket.priority && (
                        <span className="flex items-center gap-1">
                            Priority: <PriorityBadge priority={ticket.priority} />
                        </span>
                    )}
                    {ticket.resourceLocation && <span>Location: <b className="text-gray-300">{ticket.resourceLocation}</b></span>}
                    <span>Created: <b className="text-gray-300">{created}</b></span>
                </div>

                <p className="text-sm text-gray-300 whitespace-pre-wrap">{ticket.description}</p>

                {ticket.contactEmail && (
                    <p className="text-xs text-gray-500">Contact: {ticket.contactEmail}
                        {ticket.contactPhone && ` · ${ticket.contactPhone}`}</p>
                )}

                {ticket.resolutionNotes && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                        <p className="text-xs font-semibold text-green-400 mb-1">Resolution Notes</p>
                        <p className="text-sm text-gray-300">{ticket.resolutionNotes}</p>
                    </div>
                )}

                {/* Attachments */}
                {ticket.attachments?.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                            <Paperclip size={12} /> Attachments
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {ticket.attachments.map((a, i) => (
                                <a key={i}
                                   href={`http://localhost:8087/uploads/${a.filePath}`}
                                   target="_blank" rel="noreferrer"
                                   className="rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition">
                                    <img
                                        src={`http://localhost:8087/uploads/${a.filePath}`}
                                        alt={a.originalFileName}
                                        className="h-24 w-24 object-cover" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Status Update — ADMIN / TECHNICIAN only */}
            {canManage && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-base font-semibold text-white mb-4">Update Status</h2>
                    <form onSubmit={handleStatusUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1.5">Status</label>
                                <select
                                    value={statusForm.status}
                                    onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}
                                    className={selectClass}>
                                    {STATUSES.map(s => (
                                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1.5">Assign Technician</label>
                                <select
                                    value={statusForm.assignedTechnicianId}
                                    onChange={e => setStatusForm(f => ({ ...f, assignedTechnicianId: e.target.value }))}
                                    className={selectClass}>
                                    <option value="">— Unassigned —</option>
                                    {technicians.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-1.5">Resolution Notes</label>
                            <textarea
                                value={statusForm.resolutionNotes}
                                onChange={e => setStatusForm(f => ({ ...f, resolutionNotes: e.target.value }))}
                                rows={3}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5
                                           text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                                placeholder="Add resolution or progress notes…" />
                        </div>
                        <button type="submit" disabled={updating}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600
                                           hover:bg-purple-500 disabled:opacity-60 text-white text-sm transition">
                            <Save size={14} /> {updating ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* Comments */}
            <CommentSection ticketId={id} />
        </motion.div>
    );
}
