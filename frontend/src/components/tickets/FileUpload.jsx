import React, { useCallback, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const MAX_FILES = 3;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function FileUpload({ files, onChange }) {
    const [dragging, setDragging] = useState(false);

    const addFiles = (incoming) => {
        const valid = Array.from(incoming)
            .filter(f => ACCEPTED_TYPES.includes(f.type))
            .slice(0, MAX_FILES - files.length);
        if (valid.length) onChange([...files, ...valid].slice(0, MAX_FILES));
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    }, [files]);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onInputChange = (e) => addFiles(e.target.files);
    const remove = (idx) => onChange(files.filter((_, i) => i !== idx));

    return (
        <div className="space-y-3">
            {/* Drop Zone */}
            <label
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`flex flex-col items-center justify-center w-full h-32 rounded-xl
                            border-2 border-dashed cursor-pointer transition-colors
                            ${dragging
                                ? 'border-purple-400 bg-purple-500/10'
                                : 'border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                            }
                            ${files.length >= MAX_FILES ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload size={24} className="text-gray-400 mb-1" />
                <p className="text-sm text-gray-400">
                    Drag & drop images here, or{' '}
                    <span className="text-purple-400 underline">browse</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    PNG, JPG, GIF, WEBP — max 3 images
                </p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onInputChange}
                    disabled={files.length >= MAX_FILES}
                />
            </label>

            {/* Preview */}
            {files.length > 0 && (
                <ul className="flex flex-wrap gap-3">
                    {files.map((f, i) => (
                        <li key={i}
                            className="relative flex items-center gap-2 px-3 py-2 rounded-lg
                                       bg-white/10 border border-white/10 text-sm text-gray-300">
                            <Image size={14} className="text-purple-400 shrink-0" />
                            <span className="max-w-[140px] truncate">{f.name}</span>
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="ml-1 text-gray-500 hover:text-red-400 transition">
                                <X size={14} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
