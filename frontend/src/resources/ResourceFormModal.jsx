import React, { useState, useEffect } from "react";
import { api } from "../api/axiosClient";
import FloatingInput from "../components/common/FloatingInput";
import toast from "react-hot-toast";

const ResourceFormModal = ({ resource, closeModal, onResourceAdded }) => {
    const isEditMode = Boolean(resource);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        capacity: 0,
        location: "",
        availabilityStart: "",
        availabilityEnd: "",
        status: "ACTIVE"
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
    if (resource) {
        setFormData({
            name: resource.name || "",
            type: resource.type || "",
            capacity: resource.capacity || 0,
            location: resource.location || "",
            availabilityStart: resource.availabilityStart || "",
            availabilityEnd: resource.availabilityEnd || "",
            status: resource.status || "ACTIVE"
        });
    }
}, [resource]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "capacity" ? Number(value) : value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    // ⏱️ CALCULATE DURATION
    const getDuration = (start, end) => {
        if (!start || !end) return "";

        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        if (endMin <= startMin) return "Invalid time range";

        const diff = endMin - startMin;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;

        return `${hours}h ${mins > 0 ? mins + "m" : ""}`;
    };

    // VALIDATION
    const validate = () => {
        if (isEditMode) return true;

        let newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.type) newErrors.type = "Type is required";
        if (!formData.capacity || formData.capacity < 1)
            newErrors.capacity = "Capacity must be at least 1";
        if (!formData.location)
            newErrors.location = "Location is required";

        if (!formData.availabilityStart)
            newErrors.availabilityStart = "Start time required";

        if (!formData.availabilityEnd)
            newErrors.availabilityEnd = "End time required";

        // TIME VALIDATION - ONLY FOR ADD RES
        if (formData.availabilityStart && formData.availabilityEnd) {
            const [sh, sm] = formData.availabilityStart.split(":").map(Number);
            const [eh, em] = formData.availabilityEnd.split(":").map(Number);

            if (eh * 60 + em <= sh * 60 + sm) {
                newErrors.availabilityEnd = "End time must be after start time";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            if (isEditMode) {
                await api.put(`/resources/${resource.id}`, formData);
                toast.success("Resource updated successfully");
            } else {
                await api.post("/resources", formData);
                toast.success("Resource added successfully");
            }

            onResourceAdded?.();
            closeModal?.();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className="bg-[#1a1d24] p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md text-white">

                <h2 className="text-2xl font-bold mb-6">
                    {isEditMode ? "Edit Resource" : "Add New Resource"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <FloatingInput
                        label="Resource Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <FloatingInput
                        label="Type (LECTURE_HALL)"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        error={errors.type}
                    />

                    <FloatingInput
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        error={errors.capacity}
                    />

                    <FloatingInput
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={errors.location}
                    />

                    {/* TIME RANGE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <FloatingInput
                            label="Start Time"
                            name="availabilityStart"
                            type="time"
                            value={formData.availabilityStart}
                            onChange={handleChange}
                            error={errors.availabilityStart}
                        />

                        <FloatingInput
                            label="End Time"
                            name="availabilityEnd"
                            type="time"
                            value={formData.availabilityEnd}
                            onChange={handleChange}
                            error={errors.availabilityEnd}
                        />
                    </div>

                    {/* TIME DURATION PREVIEW */}
                    {formData.availabilityStart && formData.availabilityEnd && (
                        <div className="text-sm text-gray-300">
                            Duration:{" "}
                            <span className="text-purple-400">
                                {getDuration(
                                    formData.availabilityStart,
                                    formData.availabilityEnd
                                )}
                            </span>
                        </div>
                    )}

                    {/* STATUS */}
                    {isEditMode && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                            </select>
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-50 hover:scale-[1.02] transition"
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Resource"
                                    : "Save Resource"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default ResourceFormModal;