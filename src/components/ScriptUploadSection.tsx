import React, { useState, useRef } from "react";
import {
  Upload,
  Sparkles,
  FileText,
  Clapperboard,
  Sliders,
  Maximize2,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { SAMPLE_SCRIPTS, STYLE_PRESETS } from "../data/sampleScripts";
import { ImageResolution, AspectRatio } from "../types";

interface ScriptUploadSectionProps {
  scriptText: string;
  setScriptText: (text: string) => void;
  selectedStyle: string;
  setSelectedStyle: (styleId: string) => void;
  imageResolution: ImageResolution;
  setImageResolution: (res: ImageResolution) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  shotCountPreference: "condensed" | "standard" | "detailed";
  setShotCountPreference: (pref: "condensed" | "standard" | "detailed") => void;
  isProcessing: boolean;
  onGenerateStoryboard: () => void;
}

export const ScriptUploadSection: React.FC<ScriptUploadSectionProps> = ({
  scriptText,
  setScriptText,
  selectedStyle,
  setSelectedStyle,
  imageResolution,
  setImageResolution,
  aspectRatio,
  setAspectRatio,
  shotCountPreference,
  setShotCountPreference,
  isProcessing,
  onGenerateStoryboard,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setScriptText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const loadSample = (sampleId: string) => {
    const sample = SAMPLE_SCRIPTS.find((s) => s.id === sampleId);
    if (sample) {
      setScriptText(sample.scriptText);
      setSelectedStyle(sample.suggestedStyle);
      setUploadedFileName(`Sample: ${sample.title}`);
    }
  };

  const lineCount = scriptText ? scriptText.split("\n").length : 0;
  const wordCount = scriptText ? scriptText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Welcome & Subtitle */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Clapperboard className="w-3.5 h-3.5" />
          <span>Screenplay to Visual Sequence Generator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-serif">
          Turn Your Script Into Production-Ready Storyboards
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Upload any scene, screenplay, or commercial script. Gemini analyzes camera shots, lighting, and pacing, then renders high-resolution storyboard visual frames with full resolution controls.
        </p>
      </div>

      {/* Quick Sample Scripts Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Start with Curated Screenplay Excerpts
          </span>
          <span className="text-xs text-zinc-500">Click to load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_SCRIPTS.map((sample) => (
            <button
              key={sample.id}
              id={`sample-script-${sample.id}`}
              onClick={() => loadSample(sample.id)}
              className="text-left p-3 rounded-xl bg-zinc-950/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-amber-500/40 transition-all group relative overflow-hidden"
            >
              <div className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors truncate">
                {sample.title}
              </div>
              <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                {sample.genre}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Script & Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Upload & Input Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Header & File Dropzone */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                  Screenplay / Script Text
                </h3>
              </div>
              {uploadedFileName && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/80 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="max-w-[150px] truncate">{uploadedFileName}</span>
                </span>
              )}
            </div>

            {/* Drag and Drop Zone */}
            <div
              id="script-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-amber-500 bg-amber-500/10 text-amber-300"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.fountain,.fdx,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center justify-center gap-2 text-xs">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>
                  <strong className="text-zinc-300">Click to upload</strong> or drag & drop script file (.txt, .fountain, etc.)
                </span>
              </div>
            </div>

            {/* Script Textarea */}
            <div className="relative">
              <textarea
                id="script-input-textarea"
                rows={12}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="EXT. DESERT HIGHWAY - DUSK&#10;&#10;A classic Mustang speeds across the barren asphalt, exhaust purring under an indigo sky...&#10;&#10;JAX&#10;We're fifteen minutes from the rendezvous point. Keep your eyes sharp."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 rounded-xl p-4 text-zinc-200 text-xs sm:text-sm font-mono leading-relaxed resize-y focus:outline-none placeholder:text-zinc-600 transition-colors"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1 px-1">
                <span>Standard Screenplay Format (Scene Headings, Action, Character, Dialogue)</span>
                <span>
                  {wordCount} words • {lineCount} lines
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Generation Controls & Resolution Affordance */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                Production Configuration
              </h3>
            </div>

            {/* 1. Image Resolution Affordance (1K, 2K, 4K) as required */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  Storyboard Frame Resolution (gemini-3-pro-image)
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {imageResolution} HD
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["1K", "2K", "4K"] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    id={`resolution-select-${res}`}
                    type="button"
                    onClick={() => setImageResolution(res)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      imageResolution === res
                        ? "bg-amber-500/20 border-amber-500/70 text-amber-300 shadow-sm"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-sm font-bold">{res}</span>
                    <span className="text-[9px] text-zinc-500">
                      {res === "1K" ? "Fast & Sharp" : res === "2K" ? "High Quality" : "Master 4K"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Cinematic Aspect Ratio</span>
                <span className="text-[10px] text-zinc-400 font-mono">{aspectRatio}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { ratio: "16:9" as AspectRatio, label: "16:9 Widescreen" },
                  { ratio: "4:3" as AspectRatio, label: "4:3 Classic" },
                  { ratio: "1:1" as AspectRatio, label: "1:1 Square" },
                  { ratio: "9:16" as AspectRatio, label: "9:16 Vertical" },
                ].map((item) => (
                  <button
                    key={item.ratio}
                    id={`aspect-ratio-${item.ratio.replace(":", "-")}`}
                    type="button"
                    onClick={() => setAspectRatio(item.ratio)}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all text-center ${
                      aspectRatio === item.ratio
                        ? "bg-zinc-800 border-amber-500/60 text-amber-300"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-bold">{item.ratio}</div>
                    <div className="text-[9px] text-zinc-500 truncate">{item.label.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Shot Granularity / Sequence Density */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Shot Sequence Density
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "condensed", label: "Condensed", shots: "3 - 4 Shots" },
                  { id: "standard", label: "Standard", shots: "4 - 6 Shots" },
                  { id: "detailed", label: "Detailed", shots: "7 - 10 Shots" },
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`shot-density-${item.id}`}
                    type="button"
                    onClick={() => setShotCountPreference(item.id as any)}
                    className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all text-center ${
                      shotCountPreference === item.id
                        ? "bg-zinc-800 border-amber-500/60 text-amber-300"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-zinc-500">{item.shots}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Visual Style Preset */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Visual Art Style Preset
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    id={`style-preset-${style.id}`}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                      selectedStyle === style.id
                        ? "bg-amber-500/10 border-amber-500/60 text-amber-200"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{style.name}</div>
                      <div className="text-[11px] text-zinc-500 line-clamp-1">{style.description}</div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${style.badgeColor}`}>
                      {style.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                id="btn-generate-storyboard"
                onClick={onGenerateStoryboard}
                disabled={!scriptText.trim() || isProcessing}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Script & Generating Shots...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-zinc-950" />
                    <span>Generate Storyboard Sequence</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
