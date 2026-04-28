import React, { useEffect, useRef, useState } from 'react';
import { Send, Pencil, Trash2, Check, X } from 'lucide-react';
import { commentService } from '../../api/commentService';
import { useAuth } from '../../context/AuthContext';

export default function CommentSection({ ticketId }) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [text, setText]         = useState('');
    const [editing, setEditing]   = useState(null); // { id, content }
    const [loading, setLoading]   = useState(false);
    const bottomRef = useRef(null);

    const load = async () => {
        const data = await commentService.getByTicket(ticketId);
        setComments(data);
    };

    useEffect(() => { load(); }, [ticketId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const submit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        try {
            await commentService.add(ticketId, text.trim());
            setText('');
            await load();
        } finally { setLoading(false); }
    };

    const saveEdit = async () => {
        if (!editing.content.trim()) return;
        await commentService.update(ticketId, editing.id, editing.content.trim());
        setEditing(null);
        await load();
    };

    const del = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        await commentService.delete(ticketId, commentId);
        await load();
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });

    return (
        <div className="mt-8">
            <h3 className="text-base font-semibold text-white mb-4">
                Comments ({comments.length})
            </h3>

            <ul className="space-y-4">
                {comments.map(c => (
                    <li key={c.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <span className="text-sm font-medium text-purple-300">
                                    {c.authorName}
                                </span>
                                <span className="ml-2 text-[11px] text-gray-600 uppercase tracking-wide">
                                    {c.authorRole}
                                </span>
                                <span className="ml-2 text-xs text-gray-600">
                                    {formatDate(c.createdAt)}
                                    {c.edited && <span className="ml-1 italic">(edited)</span>}
                                </span>
                            </div>

                            {/* Edit / Delete — only the author */}
                            {user?.id === c.authorId && (
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        onClick={() => setEditing({ id: c.id, content: c.content })}
                                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-purple-300 transition">
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => del(c.id)}
                                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {editing?.id === c.id ? (
                            <div className="mt-2 flex gap-2">
                                <input
                                    className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5
                                               text-sm text-white focus:outline-none focus:border-purple-500"
                                    value={editing.content}
                                    onChange={e => setEditing({ ...editing, content: e.target.value })}
                                    autoFocus
                                />
                                <button onClick={saveEdit}
                                    className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition">
                                    <Check size={14} />
                                </button>
                                <button onClick={() => setEditing(null)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{c.content}</p>
                        )}
                    </li>
                ))}
            </ul>

            <div ref={bottomRef} />

            {isAuthenticated && (
                <form onSubmit={submit} className="mt-4 flex gap-3">
                    <input
                        className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5
                                   text-sm text-white placeholder-gray-500 focus:outline-none
                                   focus:border-purple-500 transition"
                        placeholder="Add a comment…"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500
                                   disabled:opacity-50 text-white transition">
                        <Send size={16} />
                    </button>
                </form>
            )}
        </div>
    );
}
