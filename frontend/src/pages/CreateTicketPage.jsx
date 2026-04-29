import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { ticketService } from '../api/ticketService';
import FileUpload from '../components/tickets/FileUpload';

const CATEGORIES = ['IT', 'FACILITIES', 'SECURITY', 'HEALTH_SAFETY', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const field = 'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm ' +
              'text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition';

export default function CreateTicketPage() {
    const navigate = useNavigate();
    const [files, setFiles]   = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]   = useState('');
    const [form, setForm]     = useState({
        title: '', resourceLocation: '', category: 'IT',
        description: '', priority: 'MEDIUM', contactEmail: '', contactPhone: '',
    });

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const ticket = await ticketService.create(form, files);
            navigate(`/tickets/${ticket.id}`);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto">

            <h1 className="text-2xl font-bold text-white mb-6">Submit New Ticket</h1>

            {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30
                                px-4 py-2.5 text-sm text-red-400">{error}</div>
            )}

            <form onSubmit={submit}
                  className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">

                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Title *</label>
                    <input name="title" value={form.title} onChange={change} required
                           className={field} placeholder="Brief description of the issue" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Category *</label>
                        <select name="category" value={form.category} onChange={change}
                                className={field}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Priority *</label>
                        <select name="priority" value={form.priority} onChange={change}
                                className={field}>
                            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Resource / Location</label>
                    <input name="resourceLocation" value={form.resourceLocation} onChange={change}
                           className={field} placeholder="e.g. Room 201, Block A" />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Description *</label>
                    <textarea name="description" value={form.description} onChange={change} required
                              rows={4} className={field + ' resize-none'}
                              placeholder="Describe the issue in detail…" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Contact Email</label>
                        <input type="email" name="contactEmail" value={form.contactEmail}
                               onChange={change} className={field} placeholder="you@email.com" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Contact Phone</label>
                        <input name="contactPhone" value={form.contactPhone} onChange={change}
                               className={field} placeholder="+1 234 567 8900" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                        Attachments <span className="text-gray-600">(max 3 images)</span>
                    </label>
                    <FileUpload files={files} onChange={setFiles} />
                </div>

                <button type="submit" disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500
                                   disabled:opacity-60 text-white font-medium text-sm transition
                                   flex items-center justify-center gap-2">
                    {loading
                        ? <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Submitting…</>
                        : <><Send size={16} /> Submit Ticket</>}
                </button>
            </form>
        </motion.div>
    );
}
