import React, { useState } from 'react';
import { api } from '../../api/axiosClient';

const ResourceFormModal = ({ closeModal, onResourceAdded }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        capacity: '',
        location: '',
        availabilityWindow: '',
        status: 'ACTIVE'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "capacity" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/resources', formData);
            onResourceAdded?.();
            setFormData({
                name: '', type: '', capacity: '', location: '', availabilityWindow: '', status: 'ACTIVE'
            });
            closeModal?.();
        } catch (error) {
            console.error("Error adding resource:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1d24] p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md text-white">

                <h2 className="text-2xl font-bold mb-6 text-white">Add New Resource</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Resource Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    />

                    <input
                        type="text"
                        name="type"
                        placeholder="Type (e.g., LECTURE_HALL)"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    />

                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        required
                        min="1"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    />

                    <input
                        type="text"
                        name="availabilityWindow"
                        placeholder="Availability Window (e.g. 08:00-17:00)"
                        value={formData.availabilityWindow}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    />

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium shadow-lg disabled:opacity-50 transition-all"
                        >
                            {loading ? "Saving..." : "Save Resource"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceFormModal;