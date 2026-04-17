import React from "react";

const FloatingInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    min,
    error
}) => {
    return (
        <div className="w-full flex flex-col gap-1">

            {/* INPUT LABEL */}
            <label className="text-sm text-gray-300">
                {label}
            </label>

            {/* INPUT */}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white 
                focus:ring-2 focus:ring-purple-500 outline-none"
            />

            {/* ERR */}
            {error && (
                <p className="text-red-400 text-sm">{error}</p>
            )}
        </div>
    );
};

export default FloatingInput;