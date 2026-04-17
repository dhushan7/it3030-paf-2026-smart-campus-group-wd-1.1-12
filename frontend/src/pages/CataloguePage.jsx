import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import ResourceFormModal from '../components/resources/ResourceFormModal';

const CataloguePage = () => {
    const [resources, setResources] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchResources = async () => {
        try {
            const endpoint = filterType ? `/resources?type=${filterType}` : '/resources';
            const response = await api.get(endpoint);
            setResources(response.data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filterType]);

    return (
        <div className="w-full font-sans animate-fade-in">
            
            <header className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-wider text-white">Campus Resources</h1>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <input 
                        type="text"
                        placeholder="Search by Type..."
                        className="px-6 py-2.5 rounded-full bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all w-full sm:w-auto"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    />
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg font-medium whitespace-nowrap transition-all"
                    >
                        + Add Resource
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div key={resource.id} className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <h2 className="text-xl font-semibold group-hover:text-purple-300 transition-colors line-clamp-2">{resource.name}</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shrink-0 ${resource.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {resource.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p><strong className="text-gray-400">Type:</strong> {resource.type}</p>
                            <p><strong className="text-gray-400">Location:</strong> {resource.location}</p>
                            <p><strong className="text-gray-400">Capacity:</strong> {resource.capacity} pax</p> {/*People Attending eXperience*/}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <ResourceFormModal 
                    closeModal={() => setIsModalOpen(false)} 
                    onResourceAdded={fetchResources} 
                />
            )}
        </div>
    );
};

export default CataloguePage;