import { useState } from 'react';
import { LogoPreviewStudio } from './components/LogoPreviewStudio';
import { AiGenerator } from './components/AiGenerator';
import { GeneratedImageItem } from './types';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<GeneratedImageItem | null>(null);

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100 flex flex-col antialiased selection:bg-fuchsia-500 selection:text-white">
      {/* Top Application Header */}
      <header className="border-b border-white/10 bg-[#090b12]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-fuchsia-950/40">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                4K Logo Studio
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  4K & 2000×2000px
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Model: gemini-3-pro-image-preview</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Interactive 4K Master Preview & Exporter (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col">
            <LogoPreviewStudio
              selectedGeneratedImage={selectedGeneratedImage}
              onClearGeneratedImage={() => setSelectedGeneratedImage(null)}
            />
          </div>

          {/* Right: AI Generator with gemini-3-pro-image-preview and 1K, 2K, 4K affordances (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col">
            <AiGenerator
              selectedImage={selectedGeneratedImage}
              onSelectImage={(item) => setSelectedGeneratedImage(item)}
              onImageGenerated={(item) => setSelectedGeneratedImage(item)}
            />
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-zinc-500">
        <p className="flex items-center justify-center gap-2">
          <span>High-Resolution 4K UHD & 2000×2000px Vector & AI Generation Studio</span>
          <span>•</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
            gemini-3-pro-image-preview
          </span>
        </p>
      </footer>
    </div>
  );
}
