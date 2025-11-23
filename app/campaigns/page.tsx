'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Calendar, MoreHorizontal, X, Loader2 } from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
    status: 'Active' | 'Draft' | 'Completed';
    assets: number;
    date: string;
}

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/campaigns');
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCampaignName) return;
        setCreating(true);
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCampaignName }),
            });
            if (res.ok) {
                const newCampaign = await res.json();
                setCampaigns([...campaigns, newCampaign]);
                setShowModal(false);
                setNewCampaignName('');
            }
        } catch (error) {
            console.error('Failed to create campaign:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-gray-800">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    DigiInfluencer
                </Link>
                <div className="flex gap-6 text-sm font-medium">
                    <Link href="/studio" className="text-gray-400 hover:text-white transition-colors">Studio</Link>
                    <Link href="/campaigns" className="text-white">Campaigns</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 mt-8">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">Campaigns</h1>
                        <p className="text-gray-400 mt-1">Manage your influencer marketing campaigns.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={18} />
                        New Campaign
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign, index) => (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg ${campaign.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                                        campaign.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        <Folder size={24} />
                                    </div>
                                    <button className="text-gray-500 hover:text-white">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{campaign.name}</h3>

                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {campaign.date}
                                    </span>
                                    <span>•</span>
                                    <span>{campaign.assets} Assets</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${campaign.status === 'Active' ? 'bg-green-900/30 text-green-400' :
                                        campaign.status === 'Draft' ? 'bg-yellow-900/30 text-yellow-400' :
                                            'bg-blue-900/30 text-blue-400'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                    <span className="text-xs text-gray-500">View Details →</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* New Campaign Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Create New Campaign</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
                                    <input
                                        value={newCampaignName}
                                        onChange={(e) => setNewCampaignName(e.target.value)}
                                        placeholder="e.g. Summer Launch 2025"
                                        autoFocus
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>

                                <button
                                    onClick={handleCreate}
                                    disabled={creating || !newCampaignName}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {creating && <Loader2 className="animate-spin" size={18} />}
                                    Create Campaign
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
