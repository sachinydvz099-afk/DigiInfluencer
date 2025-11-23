'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mic, Shirt, Plus, Trash2 } from 'lucide-react';

interface Persona {
    id: string;
    name: string;
    niche: string;
    tone: string;
    style: string;
    voice: string;
}

export default function Personas() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPersonas();
    }, []);

    const fetchPersonas = () => {
        fetch('/api/personas')
            .then(res => res.json())
            .then(data => {
                setPersonas(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this persona?')) return;

        try {
            await fetch(`/api/personas/${id}`, {
                method: 'DELETE',
            });
            setPersonas(personas.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete persona:', error);
            alert('Failed to delete persona');
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
                    <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">Campaigns</Link>
                    <Link href="/personas" className="text-white">Personas</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 mt-8">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">My Personas</h1>
                        <p className="text-gray-400 mt-1">Manage your AI influencers and their identities.</p>
                    </div>
                    <Link href="/create-persona">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/20">
                            <Plus size={18} />
                            Create Persona
                        </button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {personas.map((persona, index) => (
                            <motion.div
                                key={persona.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors group"
                            >
                                {/* Avatar Placeholder */}
                                <div className="h-32 bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl border-2 border-gray-700">
                                        {persona.name.charAt(0)}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{persona.name}</h3>
                                            <span className="text-xs font-medium px-2 py-1 bg-purple-900/30 text-purple-400 rounded-full mt-2 inline-block">
                                                {persona.niche}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-400">
                                        <div className="flex items-center gap-3">
                                            <User size={16} className="text-gray-500" />
                                            <span>{persona.tone} Tone</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Shirt size={16} className="text-gray-500" />
                                            <span>{persona.style} Style</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mic size={16} className="text-gray-500" />
                                            <span>{persona.voice}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-700/50 flex gap-2">
                                        <Link href={`/studio?persona=${persona.id}`} className="flex-1">
                                            <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                                                Use in Studio
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(persona.id)}
                                            className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
                                            title="Delete Persona"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
