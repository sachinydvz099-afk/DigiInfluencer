'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePersona() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        niche: 'Tech',
        tone: 'Professional',
        gender: 'Female',
        age: '25-30',
        style: 'Modern',
        voice: 'Voice A',
        bio: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/personas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Persona "${data.name}" created! ID: ${data.id}`);
                router.push('/'); // Go back home for now, eventually to dashboard
            } else {
                alert('Error creating persona');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-10 px-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Design Your Influencer
                    </h1>
                    <p className="text-gray-400 mt-2">Step {step} of 3</p>
                    <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className="bg-purple-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl">

                    {/* Step 1: Identity */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">1. Identity & Niche</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Sarah Tech"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Niche</label>
                                    <select
                                        name="niche"
                                        value={formData.niche}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option>Tech</option>
                                        <option>Fashion</option>
                                        <option>Fitness</option>
                                        <option>Travel</option>
                                        <option>Gaming</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                                    <select
                                        name="tone"
                                        value={formData.tone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option>Professional</option>
                                        <option>Witty</option>
                                        <option>Enthusiastic</option>
                                        <option>Calm</option>
                                        <option>Sarcastic</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Bio / Backstory</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Brief backstory..."
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none h-24"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Appearance */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">2. Appearance</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option>Female</option>
                                        <option>Male</option>
                                        <option>Non-binary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Age Range</label>
                                    <select
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option>18-24</option>
                                        <option>25-30</option>
                                        <option>30-40</option>
                                        <option>40+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Style Aesthetic</label>
                                <input
                                    name="style"
                                    value={formData.style}
                                    onChange={handleChange}
                                    placeholder="e.g. Minimalist, Streetwear, Corporate"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            <div className="p-4 border border-dashed border-gray-600 rounded-lg text-center text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors cursor-pointer">
                                <p>Upload Reference Photos (Optional)</p>
                                <p className="text-xs mt-1">Drag & drop or click to upload</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Voice & Review */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">3. Voice & Review</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Voice Model</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Voice A', 'Voice B', 'Voice C'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setFormData({ ...formData, voice: v })}
                                            className={`p-3 rounded-lg border ${formData.voice === v ? 'border-purple-500 bg-purple-500/20 text-white' : 'border-gray-700 bg-gray-900 text-gray-400'} transition-all`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mt-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Summary</h3>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-gray-500">Name:</span> <span className="text-white">{formData.name}</span>
                                    <span className="text-gray-500">Niche:</span> <span className="text-white">{formData.niche}</span>
                                    <span className="text-gray-500">Style:</span> <span className="text-white">{formData.style}</span>
                                    <span className="text-gray-500">Voice:</span> <span className="text-white">{formData.voice}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-8 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Persona'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
