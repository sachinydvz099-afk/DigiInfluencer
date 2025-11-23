'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/health');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(`Online: ${data.status}`);
        } else {
          setBackendStatus('Offline (Server error)');
        }
      } catch (e) {
        setBackendStatus('Offline (Is backend running?)');
      }
    };
    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          DigiInfluencer
        </div>
        <div className="flex items-center gap-6">
          <Link href="/studio" className="text-gray-300 hover:text-white transition-colors">Studio</Link>
          <div className="text-sm text-gray-400">
            Backend Status: <span className={backendStatus.includes('Online') ? 'text-green-400' : 'text-red-400'}>{backendStatus}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 mt-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Stop Hiring Models. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Start Designing Them.
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-10">
          Create a consistent, photorealistic AI Influencer for your brand.
          Generate unlimited videos, photos, and ads with one digital face that never sleeps.
        </p>

        <Link href="/create-persona">
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30">
            Start Creating for Free
          </button>
        </Link>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 max-w-7xl mx-auto">
          <FeatureCard
            title="Perfect Consistency"
            desc="Our AI remembers your influencer's face. Every shot looks like the same person."
            icon="✨"
          />
          <FeatureCard
            title="Talk the Talk"
            desc="Turn text into viral video content with perfect lip-sync and human-like gestures."
            icon="🎥"
          />
          <FeatureCard
            title="Infinite Wardrobe"
            desc="Change outfits, backgrounds, and styles in seconds without a reshoot."
            icon="👗"
          />
          <FeatureCard
            title="Ad-Ready in Minutes"
            desc="Auto-generate Instagram Stories, TikToks, and Banners formatted for conversion."
            icon="⚡"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-10 text-center text-gray-500 border-t border-gray-800">
        <p>&copy; 2025 DigiInfluencer. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}
