import React, { useState } from "react";
import { api } from "../api/axiosClient";
import toast from "react-hot-toast";

const BookingFormModal = ({ resource, closeModal, onBooked }) => {
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.startTime || !formData.endTime) {
            return toast.error("All fields required");
        }

        try {
            setLoading(true);

            await api.post("/bookings", {
                resourceId: resource.id,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
            });

            toast.success("Booking successful 🎉");
            onBooked();
            closeModal();
        } catch (err) {
            toast.error("Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            {/* MODAL */}
            <div className="bg-[#1a1d24] p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-xl">

                <h2 className="text-xl font-bold text-white mb-4">
                    Book {resource.name}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-black/30 text-white border border-white/10"
                    />

                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-black/30 text-white border border-white/10"
                    />

                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-black/30 text-white border border-white/10"
                    />

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded bg-gray-500/20 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-green-500 text-white"
                        >
                            {loading ? "Booking..." : "Confirm"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default BookingFormModal;