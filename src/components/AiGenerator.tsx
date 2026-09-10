import React, { useState, useRef } from 'react';
import { ImageSize, GeneratedImageItem } from '../types';
import { Sparkles, Image as ImageIcon, Upload, RefreshCw, Download, Check, AlertCircle, Eye, Sliders, Zap } from 'lucide-react';

interface AiGeneratorProps {
  onImageGenerated?: (item: GeneratedImageItem) => void;
  selectedImage?: GeneratedImageItem | null;
  onSelectImage?: (item: GeneratedImageItem) => void;
}

export const AiGenerator: React.FC<AiGeneratorProps> = ({
  onImageGenerated,
  selectedImage,
  onSelectImage,
}) => {
  const [imageSize, setImageSize] = useState<ImageSize>('4K');
  const [prompt, setPrompt] = useState<string>(
    "A clean, ultra-high-resolution 3D twisting ribbon logo in the shape of a smooth modern stylized letter 'S'. The ribbon has fluid organic curves with subtle volumetric depth, beautiful satin sheen, and clean inner shadows where the ribbon overlaps. The color transitions in a seamless, glowing neon gradient from electric sky blue at the top, shifting into vibrant violet-purple, and flowing down into brilliant hot magenta-pink at the bottom loop. Perfectly centered on a pure pitch black background (#000000), 4K vector-like fidelity, premium iconic branding mark."
  );
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetPrompts = [
    {
      label: 'Original Satin 3D',
      prompt:
        "Sleek 3D twisting ribbon letter 'S' logo, fluid satin curves, smooth gradient from electric cyan-blue to vivid purple to hot magenta-pink, deep black solid background, 4k ultra high fidelity.",
    },
    {
      label: 'Liquid Chrome & Neon',
      prompt:
        "Polished liquid chrome 3D twisting 'S' ribbon logo with iridescent electric cyan and magenta reflections, sharp reflections, glossy specular sheen, pitch black background, 4K rendering.",
    },
    {
      label: 'Frosted Glass Prism',
      prompt:
        "Translucent frosted glass 3D twisting letter 'S' logo, internal caustic refraction, glowing core transitioning from sapphire blue to ruby magenta, minimal black background, 4K resolution.",
    },
    {
      label: 'Cyberpunk Glow',
      prompt:
        "Futuristic neon plasma 3D ribbon 'S' monogram, glowing intense cyan edge highlights, dark violet core and neon fuchsia tail, ambient volumetric bloom, deep black background, 4K.",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReferenceImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(`Requesting gemini-3-pro-image-preview at ${imageSize} resolution...`);

    try {
      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          aspectRatio: '1:1',
          referenceImage: referenceImage || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      const newItem: GeneratedImageItem = {
        id: 'gen-' + Date.now(),
        url: data.imageUrl,
        prompt,
        size: imageSize,
        model: data.modelUsed || 'gemini-3-pro-image-preview',
        createdAt: Date.now(),
        width: imageSize === '4K' ? 4096 : imageSize === '2K' ? 2048 : 1024,
        height: imageSize === '4K' ? 4096 : imageSize === '2K' ? 2048 : 1024,
      };

      setGallery((prev) => [newItem, ...prev]);
      if (onImageGenerated) {
        onImageGenerated(newItem);
      }
      if (onSelectImage) {
        onSelectImage(newItem);
      }
      setStatusMessage('Generation completed successfully!');
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'An error occurred during AI image generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = (item: GeneratedImageItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `logo-${item.size.toLowerCase()}-${item.width}x${item.height}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="ai-generator-panel" className="bg-[#0f111a] border border-white/10 rounded-2xl p-6 text-white space-y-6">
      {/* Header with Model Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-900/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">AI Logo Generator</h2>
            <p className="text-xs text-zinc-400">Generate high-fidelity variations with Gemini Image</p>
          </div>
        </div>

        {/* Model and Engine Indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-300">
            <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
            gemini-3-pro-image-preview
          </span>
        </div>
      </div>

      {/* Image Size Selection Affordance (1K, 2K, 4K) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Target Image Resolution
          </label>
          <span className="text-[11px] text-zinc-400">
            {imageSize === '4K' ? 'Ultra HD (4096×4096 / 2000×2000px)' : imageSize === '2K' ? '2K HD (2048×2048px)' : 'Standard (1024×1024px)'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 p-1 bg-black/40 rounded-xl border border-white/5">
          {(['1K', '2K', '4K'] as ImageSize[]).map((size) => {
            const isSelected = imageSize === size;
            return (
              <button
                key={size}
                id={`size-btn-${size}`}
                type="button"
                onClick={() => setImageSize(size)}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-950/50 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="tracking-wide text-base">{size}</span>
                <span className="text-[10px] opacity-80">
                  {size === '1K' ? '1024 px' : size === '2K' ? '2048 px' : '4096 / 2000 px'}
                </span>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Configuration */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Design Prompt & Style
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Describe your logo styling, ribbons, materials, and lighting..."
          className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
        />

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presetPrompts.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPrompt(preset.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reference Image Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-fuchsia-400" />
            Reference Image (Optional)
          </label>
          {referenceImage && (
            <button
              type="button"
              onClick={() => setReferenceImage(null)}
              className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        {referenceImage ? (
          <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10 rounded-xl">
            <img
              src={referenceImage}
              alt="Reference preview"
              className="w-14 h-14 object-cover rounded-lg border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs">
              <p className="font-medium text-zinc-200">Custom Reference Image Loaded</p>
              <p className="text-zinc-400 text-[11px]">Gemini will guide generation based on this seed</p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-white/15 rounded-xl p-3 text-center cursor-pointer hover:border-cyan-500/50 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-400">Click or drag & drop a logo image to use as reference</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      {/* Generate Action Button */}
      <button
        id="generate-button"
        type="button"
        disabled={isLoading}
        onClick={handleGenerate}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
          isLoading
            ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white shadow-fuchsia-900/30 active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Rendering in {imageSize}...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Logo in {imageSize} with Gemini 3 Pro</span>
          </>
        )}
      </button>

      {/* Status & Error Feedback */}
      {statusMessage && !error && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Generation Notice</span>
          </div>
          <p className="text-[11px] text-zinc-300 pl-6">{error}</p>
          <p className="text-[10px] text-zinc-400 pl-6">
            Tip: You can instantly export the crisp 4K or 2000x2000px master vector logo using the built-in Master Exporter on the left!
          </p>
        </div>
      )}

      {/* Generated History / Gallery */}
      {gallery.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Generated AI Variations ({gallery.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-xl overflow-hidden border transition-all bg-black/60 ${
                  selectedImage?.id === item.id ? 'border-fuchsia-500 shadow-lg shadow-fuchsia-950/50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={item.url}
                  alt="Generated variation"
                  className="w-full aspect-square object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                    {item.size}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button
                    type="button"
                    title="View preview"
                    onClick={() => onSelectImage?.(item)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title={`Download ${item.size} PNG`}
                    onClick={() => handleDownloadImage(item)}
                    className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
