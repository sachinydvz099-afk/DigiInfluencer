'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Image as ImageIcon, Video, Layout, Download, Save, Wand2, Check } from 'lucide-react';

function StudioContent() {
    const searchParams = useSearchParams();
    const preSelectedPersonaId = searchParams.get('persona');

    const [activeTab, setActiveTab] = useState<'image' | 'video' | 'ad'>('image');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');

    const [personas, setPersonas] = useState<{ id: string, name: string }[]>([]);
    const [selectedPersona, setSelectedPersona] = useState(preSelectedPersonaId || '');

    // Campaign Saving State
    const [campaigns, setCampaigns] = useState<{ id: string, name: string }[]>([]);
    const [showSaveMenu, setShowSaveMenu] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Fetch personas
        fetch('/api/personas')
            .then(res => res.json())
            .then(data => {
                setPersonas(data);
                if (!selectedPersona && data.length > 0) {
                    setSelectedPersona(data[0].id);
                }
            })
            .catch(err => console.error('Failed to fetch personas:', err));

        // Fetch campaigns
        fetch('/api/campaigns')
            .then(res => res.json())
            .then(data => setCampaigns(data))
            .catch(err => console.error('Failed to fetch campaigns:', err));
    }, []);

    const handleGenerate = async () => {
        if (!prompt || !selectedPersona) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: activeTab,
                    persona_id: selectedPersona,
                    prompt: prompt,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data.url);
            } else {
                alert('Generation failed');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveToCampaign = async (campaignId: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/campaigns/${campaignId}/assets`, {
                method: 'POST',
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                setShowSaveMenu(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        if (!result) return;
        try {
            const response = await fetch(result);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `digi-influencer-${activeTab}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(result, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur z-10">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    DigiInfluencer Studio
                </Link>
                <div className="flex gap-6 text-sm font-medium items-center">
                    <Link href="/studio" className="text-white">Studio</Link>
                    <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">Campaigns</Link>
                    <Link href="/personas" className="text-gray-400 hover:text-white transition-colors">Personas</Link>
                    <Link href="/create-persona" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">New Persona</Link>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-purple-500/30">
                        JS
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-80 bg-gray-800/30 border-r border-gray-800 p-6 flex flex-col gap-8 overflow-y-auto z-10">

                    {/* Mode Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Asset Type</label>
                        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                            {[
                                { id: 'image', icon: ImageIcon },
                                { id: 'video', icon: Video },
                                { id: 'ad', icon: Layout }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setActiveTab(mode.id as any)}
                                    className={`flex-1 py-3 rounded-lg flex items-center justify-center transition-all ${activeTab === mode.id ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    <mode.icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Persona Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Select Persona</label>
                        <select
                            value={selectedPersona}
                            onChange={(e) => setSelectedPersona(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        >
                            {personas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    {/* Prompt Input */}
                    <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                            {activeTab === 'video' ? 'Script & Action' : 'Prompt Description'}
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={activeTab === 'video'
                                ? "Say: 'Hello everyone!' while waving at the camera..."
                                : "A futuristic portrait in a neon city..."}
                            className="w-full flex-1 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none min-h-[200px] text-sm leading-relaxed"
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !prompt}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 size={20} />
                                Generate Asset
                            </>
                        )}
                    </button>
                </aside>

                {/* Main Canvas Area */}
                <main className="flex-1 bg-black/50 flex items-center justify-center p-10 relative overflow-hidden">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    </div>

                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group max-w-4xl w-full bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
                            >
                                {/* Result Display */}
                                <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
                                    <img src={result} alt="Generated Asset" className="w-full h-full object-cover" />
                                </div>

                                {/* Action Bar */}
                                <div className="p-6 bg-gray-800 flex justify-between items-center border-t border-gray-700 relative">
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Generated successfully
                                    </div>
                                    <div className="flex gap-3 relative">
                                        <button
                                            onClick={handleDownload}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Download size={16} /> Download
                                        </button>

                                        <div className="relative">
                                            <button
                                                onClick={() => setShowSaveMenu(!showSaveMenu)}
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-500/20"
                                            >
                                                {saved ? <Check size={16} /> : <Save size={16} />}
                                                {saved ? 'Saved!' : 'Save to Campaign'}
                                            </button>

                                            {/* Save Menu Dropdown */}
                                            <AnimatePresence>
                                                {showSaveMenu && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-20"
                                                    >
                                                        <div className="p-3 border-b border-gray-700 text-xs font-bold text-gray-500 uppercase">
                                                            Select Campaign
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto">
                                                            {campaigns.map(c => (
                                                                <button
                                                                    key={c.id}
                                                                    onClick={() => handleSaveToCampaign(c.id)}
                                                                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm transition-colors flex justify-between items-center"
                                                                >
                                                                    {c.name}
                                                                    {saving && <Loader2 className="animate-spin" size={12} />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-gray-600"
                            >
                                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700"
                                >
                                    <Wand2 size={40} className="opacity-50" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-300 mb-2">Ready to Create</h2>
                                <p className="text-gray-500">Select a persona and enter a prompt to begin.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default function Studio() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StudioContent />
        </Suspense>
    );
}
