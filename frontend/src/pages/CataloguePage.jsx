import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import ResourceFormModal from '../resources/ResourceFormModal';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    // FETCH
    const fetchResources = async () => {
        try {
            const endpoint = filterType 
                ? `/resources?type=${filterType}` 
                : '/resources';

            const res = await api.get(endpoint);
            setResources(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load resources");
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filterType]);

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this resource?")) return;

        try {
            await api.delete(`/resources/${id}`);
            toast.success("Deleted successfully");
            fetchResources();
        } catch {
            toast.error("Delete failed");
        }
    };

    // STATUS 
    const handleToggleStatus = async (resource) => {
        const newStatus =
            resource.status === 'ACTIVE'
                ? 'OUT_OF_SERVICE'
                : 'ACTIVE';

        try {
            setLoadingId(resource.id);

            await api.patch(
                `/resources/${resource.id}/status?status=${newStatus}`
            );

            toast.success(`Now ${newStatus}`);
            fetchResources();
        } catch {
            toast.error("Status update failed");
        } finally {
            setLoadingId(null);
        }
    };

    const getTimeLabel = (start, end) => {
        if (!start || !end) return "Not set";

        const s = start.slice(0, 5);
        const e = end.slice(0, 5);

        const [sh, sm] = s.split(":").map(Number);
        const [eh, em] = e.split(":").map(Number);

        const durationMin = (eh * 60 + em) - (sh * 60 + sm);

        if (durationMin <= 0) return `${s} - ${e}`;

        const h = Math.floor(durationMin / 60);
        const m = durationMin % 60;

        return `${s} - ${e} (${h}h${m ? ` ${m}m` : ""})`;
    };

    return (
        <div className="w-[82vw] font-sans animate-fade-in">

            {/* HEADER */}
            <header className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                <h1 className="text-3xl font-bold text-white">
                    Campus Resources
                </h1>

                <div className="flex gap-4 w-full md:w-auto">

                    <input
                        type="text"
                        placeholder="Search by Type..."
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 rounded-full bg-black/20 text-white border border-white/10 focus:ring-2 focus:ring-purple-400 outline-none"
                    />

                    <button
                        onClick={() => {
                            setSelectedResource(null);
                            setIsModalOpen(true);
                        }}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    >
                        + Add
                    </button>

                </div>
            </header>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {resources.map((r) => (
                    <div
                        key={r.id}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition"
                    >

                        {/* TOP */}
                        <div className="flex justify-between mb-3">
                            <h2 className="text-lg font-semibold text-white">
                                {r.name}
                            </h2>

                            <div className="flex gap-2">

                                {/* EDIT */}
                                <button
                                    onClick={() => {
                                        setSelectedResource(r);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 bg-blue-500/20 rounded-full"
                                >
                                    <Pencil size={14} className="text-blue-400" />
                                </button>

                                {/* DELETE */}
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="p-2 bg-red-500/20 rounded-full"
                                >
                                    <Trash2 size={14} className="text-red-400" />
                                </button>

                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="text-sm text-gray-300 space-y-1">
                            <p><b>Type:</b> {r.type}</p>
                            <p><b>Location:</b> {r.location}</p>
                            <p><b>Capacity:</b> {r.capacity} pax</p>
                            <p>
                                <b>Available:</b>{" "}
                                <span className="text-purple-300">
                                    {getTimeLabel(r.availabilityStart, r.availabilityEnd)}
                                </span>
                            </p>
                        </div>

                        {/* STATUS */}
                        <div className="flex justify-between items-center mt-4">

                            {/* STATUS BADGE */}
                            <span
                                className={`px-3 py-1 text-xs rounded-full font-bold 
                                ${r.status === 'ACTIVE'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}
                            >
                                {r.status}
                            </span>

                            {/* TOGGLE SWITCH */}
                            <button
                                onClick={() => handleToggleStatus(r)}
                                disabled={loadingId === r.id}
                                className={`relative w-14 h-7 rounded-full transition 
                                ${r.status === 'ACTIVE'
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                    }
                                ${loadingId === r.id ? 'opacity-50' : ''}`}
                            >

                                {/* SLIDER */}
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform
                                    ${r.status === 'ACTIVE'
                                            ? 'translate-x-7'
                                            : ''
                                        }`}
                                />

                            </button>

                        </div>

                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <ResourceFormModal
                    resource={selectedResource}
                    closeModal={() => {
                        setIsModalOpen(false);
                        setSelectedResource(null);
                    }}
                    onResourceAdded={fetchResources}
                />
            )}

        </div>
    );
};

export default CataloguePage;