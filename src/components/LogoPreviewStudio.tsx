import React, { useState } from 'react';
import { LogoVector, defaultThemes } from './LogoVector';
import { LogoTheme, GeneratedImageItem } from '../types';
import { exportSvgElement } from '../utils/canvasExport';
import {
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Check,
  Palette,
  Eye,
  Sliders,
} from 'lucide-react';

interface LogoPreviewStudioProps {
  selectedGeneratedImage?: GeneratedImageItem | null;
  onClearGeneratedImage?: () => void;
}

export const LogoPreviewStudio: React.FC<LogoPreviewStudioProps> = ({
  selectedGeneratedImage,
  onClearGeneratedImage,
}) => {
  const [currentTheme, setCurrentTheme] = useState<LogoTheme>(defaultThemes[0]);
  const [showGlow, setShowGlow] = useState(true);
  const [transparentBg, setTransparentBg] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const handleExport = async (
    width: number,
    height: number,
    format: 'png' | 'webp' | 'svg',
    filename: string,
    isTransparent = false
  ) => {
    setIsExporting(true);
    setExportSuccessMsg(null);
    try {
      await exportSvgElement('master-logo-svg', {
        width,
        height,
        format,
        transparent: isTransparent,
        filename,
        backgroundColor: isTransparent ? undefined : '#000000',
      });
      setExportSuccessMsg(`Successfully exported ${filename}`);
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Failed to export: ' + (err?.message || err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-[#0b0d14] border border-white/10 rounded-2xl p-6 text-white space-y-6 flex flex-col h-full">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">4K Master Logo Studio</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              2000×2000 & 4K UHD
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vector-rendered 3D S-Ribbon with authentic satin curvature & dual-chroma glow
          </p>
        </div>

        {/* View Controls: Zoom & Grid */}
        <div className="flex items-center gap-2 bg-black/50 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            title="Zoom out"
            onClick={() => setZoomLevel((prev) => Math.max(50, prev - 25))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-2 text-zinc-300 min-w-[3rem] text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            title="Zoom in"
            onClick={() => setZoomLevel((prev) => Math.min(300, prev + 25))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Reset Zoom (Fit)"
            onClick={() => setZoomLevel(100)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Display Area */}
      <div className="relative flex-1 min-h-[380px] max-h-[520px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-black">
        {/* Background checkerboard pattern if transparent */}
        {transparentBg && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #333 25%, transparent 25%), 
                linear-gradient(-45deg, #333 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #333 75%), 
                linear-gradient(-45deg, transparent 75%, #333 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
        )}

        {/* Selected AI Generated Image Overlay / Compare Mode */}
        {selectedGeneratedImage && compareMode ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
            {/* Base Vector */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.15s ease-out' }}
            >
              <div className="w-[360px] h-[360px] max-w-full aspect-square">
                <LogoVector theme={currentTheme} showGlow={showGlow} transparentBg={transparentBg} />
              </div>
            </div>

            {/* Clipped AI Image */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
                transform: `scale(${zoomLevel / 100})`,
                transition: 'transform 0.15s ease-out',
              }}
            >
              <div className="w-[360px] h-[360px] max-w-full aspect-square">
                <img
                  src={selectedGeneratedImage.url}
                  alt="AI Generated"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Slider divider line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-20 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center -ml-0.5">
                <Sliders className="w-3.5 h-3.5 text-black rotate-90" />
              </div>
            </div>

            {/* Input overlay for slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />

            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-cyan-300 border border-cyan-500/30 z-10">
              Vector Master (Left)
            </div>
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-fuchsia-300 border border-fuchsia-500/30 z-10">
              AI {selectedGeneratedImage.size} (Right)
            </div>
          </div>
        ) : selectedGeneratedImage ? (
          /* Viewing Selected AI image directly */
          <div
            className="flex items-center justify-center w-full h-full p-4 transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div className="relative w-[360px] h-[360px] max-w-full aspect-square">
              <img
                src={selectedGeneratedImage.url}
                alt="AI Generated Logo"
                className="w-full h-full object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-fuchsia-300 border border-fuchsia-500/40">
                  AI {selectedGeneratedImage.size} ({selectedGeneratedImage.width}×{selectedGeneratedImage.height})
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Vector Canvas */
          <div
            className="flex items-center justify-center w-full h-full p-4 transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div className="w-[360px] h-[360px] max-w-full aspect-square">
              <LogoVector
                id="master-logo-svg"
                theme={currentTheme}
                showGlow={showGlow}
                transparentBg={transparentBg}
              />
            </div>
          </div>
        )}

        {/* Resolution Watermark & Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/10">
            Target Canvas: 2000×2000px | 4K (4096×4096)
          </span>
          {selectedGeneratedImage && (
            <button
              type="button"
              onClick={() => setCompareMode(!compareMode)}
              className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-md text-[11px] font-medium text-cyan-300 border border-cyan-500/30 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {compareMode ? 'Exit Split View' : 'Compare with Vector'}
            </button>
          )}
        </div>

        {selectedGeneratedImage && (
          <button
            type="button"
            onClick={onClearGeneratedImage}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 hover:bg-black/90 backdrop-blur-md text-[11px] text-zinc-300 border border-white/20 transition-colors"
          >
            Switch to Vector Master
          </button>
        )}
      </div>

      {/* Success Banner */}
      {exportSuccessMsg && (
        <div className="p-3 rounded-xl bg-green-950/40 border border-green-500/30 text-xs text-green-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* Quick Customization Toolbar */}
      {!selectedGeneratedImage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
          {/* Color Themes */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              Color Palette
            </span>
            <div className="flex flex-wrap gap-1.5">
              {defaultThemes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCurrentTheme(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    currentTheme.id === t.id
                      ? 'bg-white/15 text-white border-cyan-400 shadow'
                      : 'bg-white/5 text-zinc-400 border-white/5 hover:text-zinc-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${t.topColor}, ${t.botColor})`,
                    }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* FX Toggles */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
              Effects & Canvas
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowGlow(!showGlow)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  showGlow
                    ? 'bg-fuchsia-950/60 text-fuchsia-200 border-fuchsia-500/40'
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-zinc-200'
                }`}
              >
                Ambient Glow: {showGlow ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => setTransparentBg(!transparentBg)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  transparentBg
                    ? 'bg-cyan-950/60 text-cyan-200 border-cyan-500/40'
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-zinc-200'
                }`}
              >
                Background: {transparentBg ? 'Transparent' : 'Solid Black'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant 1-Click Master Exporters */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Instant Master Downloads
          </label>
          <span className="text-[11px] text-zinc-400">High-DPI Razor Sharp Renders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 2000x2000px PNG Button (Direct User Request) */}
          <button
            id="download-2000px-btn"
            type="button"
            disabled={isExporting}
            onClick={() =>
              handleExport(
                2000,
                2000,
                'png',
                'logo-twist-s-2000x2000.png',
                transparentBg
              )
            }
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs transition-all shadow-lg shadow-cyan-950/50 flex flex-col items-start gap-1 group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-sm text-white">2000×2000 px</span>
              <Download className="w-4 h-4 text-cyan-200 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-cyan-100/80">PNG (Exact Request)</span>
          </button>

          {/* 4K Ultra HD PNG Button (Direct User Request) */}
          <button
            id="download-4k-btn"
            type="button"
            disabled={isExporting}
            onClick={() =>
              handleExport(
                4096,
                4096,
                'png',
                'logo-twist-s-4k-4096x4096.png',
                transparentBg
              )
            }
            className="p-3 rounded-xl bg-gradient-to-r from-purple-600/90 to-fuchsia-600/90 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium text-xs transition-all shadow-lg shadow-fuchsia-950/50 flex flex-col items-start gap-1 group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-sm text-white">4K UHD Master</span>
              <Sparkles className="w-4 h-4 text-fuchsia-200 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-[10px] text-fuchsia-100/80">4096×4096 px PNG</span>
          </button>

          {/* Scalable SVG Vector */}
          <button
            id="download-svg-btn"
            type="button"
            disabled={isExporting}
            onClick={() =>
              handleExport(
                2000,
                2000,
                'svg',
                'logo-twist-s-vector.svg',
                transparentBg
              )
            }
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex flex-col items-start gap-1 group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-sm text-zinc-100">Vector SVG</span>
              <Download className="w-4 h-4 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-zinc-400">Infinite Scale Lossless</span>
          </button>

          {/* 4K Transparent PNG */}
          <button
            id="download-transparent-btn"
            type="button"
            disabled={isExporting}
            onClick={() =>
              handleExport(
                2000,
                2000,
                'png',
                'logo-twist-s-transparent-2000px.png',
                true
              )
            }
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex flex-col items-start gap-1 group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-sm text-zinc-100">Transparent PNG</span>
              <Download className="w-4 h-4 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-zinc-400">2000px No Background</span>
          </button>
        </div>
      </div>
    </div>
  );
};
