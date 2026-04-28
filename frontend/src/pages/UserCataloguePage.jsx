import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosClient';
import toast from 'react-hot-toast';

const UserCataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchResources = async () => {
        try {
            setLoading(true);

            const endpoint = filterType
                ? `/resources?type=${filterType}`
                : '/resources';

            const res = await api.get(endpoint);

            const activeResources = res.data.filter(
                (r) => r.status === 'ACTIVE'
            );

            setResources(activeResources);
        } catch (err) {
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filterType]);

    // ✅ NAVIGATE TO BOOKING PAGE
    const handleBook = (resource) => {
        navigate('/bookings/new', {
            state: { resource }
        });
    };

    return (
        <div className="w-full p-6 font-sans animate-fade-in">

            {/* HEADER */}
            <header className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                <h1 className="text-3xl font-bold text-white">
                    Browse Resources
                </h1>

                <input
                    type="text"
                    placeholder="Search by Type..."
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 rounded-full bg-black/20 text-white border border-white/10 focus:ring-2 focus:ring-purple-400 outline-none w-full md:w-64"
                />
            </header>

            {/* LOADING */}
            {loading && (
                <p className="text-gray-300">Loading resources...</p>
            )}

            {/* EMPTY STATE */}
            {!loading && resources.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    No resources found 😢
                </div>
            )}

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {resources.map((r) => (
                    <div
                        key={r.id}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 hover:scale-[1.02] transition duration-300"
                    >

                        {/* TITLE */}
                        <h2 className="text-lg font-semibold text-white mb-2">
                            {r.name}
                        </h2>

                        {/* DETAILS */}
                        <div className="text-sm text-gray-300 space-y-1">
                            <p><b>Type:</b> {r.type}</p>
                            <p><b>Location:</b> {r.location}</p>
                            <p><b>Capacity:</b> {r.capacity} pax</p>
                        </div>

                        {/* STATUS */}
                        <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 font-semibold">
                            Available
                        </span>

                        {/* BOOK BUTTON */}
                        <button
                            onClick={() => handleBook(r)}
                            className="mt-5 w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:scale-105 active:scale-95 transition"
                        >
                            Book Now
                        </button>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default UserCataloguePage;