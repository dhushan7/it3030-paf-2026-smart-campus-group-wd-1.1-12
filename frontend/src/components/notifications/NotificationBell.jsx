import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../../api/notificationService';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread]               = useState(0);
    const [open, setOpen]                   = useState(false);
    const ref = useRef(null);

    const fetchNotifications = async () => {
        try {
            const data  = await notificationService.getAll();
            setNotifications(data);
            setUnread(data.filter(n => !n.read).length);
        } catch { /* ignore if unauthenticated */ }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30_000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkRead = async (id) => {
        await notificationService.markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAll = async () => {
        await notificationService.markAllAsRead();
        fetchNotifications();
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-full hover:bg-white/10 transition"
                aria-label="Notifications"
            >
                <Bell size={22} className="text-gray-300" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center
                                     rounded-full bg-purple-500 text-[10px] font-bold text-white">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10
                                bg-[#1a1d24]/95 backdrop-blur-xl shadow-2xl z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <span className="font-semibold text-white text-sm">Notifications</span>
                        {unread > 0 && (
                            <button onClick={handleMarkAll}
                                className="text-xs text-purple-400 hover:text-purple-300">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <ul className="max-h-72 overflow-y-auto divide-y divide-white/5">
                        {notifications.length === 0 && (
                            <li className="px-4 py-6 text-center text-sm text-gray-500">
                                No notifications
                            </li>
                        )}
                        {notifications.map(n => (
                            <li key={n.id}
                                className={`px-4 py-3 hover:bg-white/5 transition cursor-pointer
                                            ${n.read ? 'opacity-60' : ''}`}
                                onClick={() => !n.read && handleMarkRead(n.id)}>
                                <p className="text-xs font-semibold text-white">{n.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                {!n.read && (
                                    <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
