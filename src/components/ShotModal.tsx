import React, { useState } from "react";
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Maximize2,
  Wand2,
  Camera,
  Layers,
  FileText,
  Volume2,
} from "lucide-react";
import { StoryboardShot, ImageResolution, AspectRatio } from "../types";

interface ShotModalProps {
  shot: StoryboardShot | null;
  onClose: () => void;
  onUpdateShot: (updatedShot: StoryboardShot) => void;
  onRegenerateImage: (
    shotId: string,
    customPrompt?: string,
    res?: ImageResolution,
    ratio?: AspectRatio,
    editBase64?: string
  ) => Promise<void>;
  onDownloadImage: (shot: StoryboardShot) => void;
}

export const ShotModal: React.FC<ShotModalProps> = ({
  shot,
  onClose,
  onUpdateShot,
  onRegenerateImage,
  onDownloadImage,
}) => {
  if (!shot) return null;

  const [promptText, setPromptText] = useState(shot.imagePrompt || "");
  const [resolution, setResolution] = useState<ImageResolution>(shot.imageSize || "1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(shot.aspectRatio || "16:9");
  const [visualDescription, setVisualDescription] = useState(shot.visualDescription || "");
  const [dialogue, setDialogue] = useState(shot.dialogueAudio || "");
  const [lens, setLens] = useState(shot.lens || "");
  const [cameraMovement, setCameraMovement] = useState(shot.cameraMovement || "");
  const [lighting, setLighting] = useState(shot.lightingAtmosphere || "");
  const [refinePrompt, setRefinePrompt] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSaveDetails = () => {
    onUpdateShot({
      ...shot,
      imagePrompt: promptText,
      imageSize: resolution,
      aspectRatio,
      visualDescription,
      dialogueAudio: dialogue,
      lens,
      cameraMovement,
      lightingAtmosphere: lighting,
    });
  };

  const handleGenerateWithParams = async () => {
    setIsUpdating(true);
    try {
      await onRegenerateImage(shot.id, promptText, resolution, aspectRatio);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApplyRefine = async () => {
    if (!refinePrompt.trim()) return;
    setIsUpdating(true);
    try {
      // If we have an existing image, send it as reference for editing
      const editBase64 = shot.imageUrl ? shot.imageUrl : undefined;
      await onRegenerateImage(
        shot.id,
        refinePrompt,
        resolution,
        aspectRatio,
        editBase64
      );
      setRefinePrompt("");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      id="shot-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="shot-modal-container"
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              #{shot.shotNumber}
            </span>
            <div>
              <h3 className="font-bold text-zinc-100 text-base font-serif">
                Shot Frame Inspector & Refinement Studio
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {shot.shotType} • {lens || "35mm Prime"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-close"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Visual Frame Canvas */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center shadow-inner group">
                {shot.imageUrl ? (
                  <img
                    src={shot.imageUrl}
                    alt={`Shot ${shot.shotNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <Camera className="w-10 h-10 text-zinc-700" />
                    <p className="text-sm text-zinc-400">No visual generated for this shot yet.</p>
                  </div>
                )}

                {isUpdating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-semibold text-amber-300">
                      Processing Visual with gemini-3-pro-image ({resolution})...
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Frame Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Resolution:</span>
                  {(["1K", "2K", "4K"] as ImageResolution[]).map((res) => (
                    <button
                      key={res}
                      id={`modal-res-${res}`}
                      onClick={() => setResolution(res)}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        resolution === res
                          ? "bg-amber-500 text-zinc-950 shadow-sm"
                          : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {shot.imageUrl && (
                    <button
                      id="btn-modal-download"
                      onClick={() => onDownloadImage(shot)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  )}

                  <button
                    id="btn-modal-re-render"
                    onClick={handleGenerateWithParams}
                    disabled={isUpdating}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? "animate-spin" : ""}`} />
                    <span>Render Frame ({resolution})</span>
                  </button>
                </div>
              </div>

              {/* AI Image Modification / Edit Tool */}
              <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <span>Iterative AI Refinement & Image Editing</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Describe modifications to this shot (e.g., "Add volumetric fog and rain", "Zoom into character's shocked expression", "Change lighting to harsh neon green").
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="modal-refine-prompt-input"
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="Enter visual modification instruction..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/80"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyRefine();
                    }}
                  />
                  <button
                    id="btn-modal-apply-refine"
                    onClick={handleApplyRefine}
                    disabled={!refinePrompt.trim() || isUpdating}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Refinement</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Prompt & Shot Specifications */}
            <div className="lg:col-span-5 space-y-4">
              {/* Detailed Image Prompt */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    AI Image Generation Prompt
                  </label>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-[11px] text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-amber-500/80"
                />
              </div>

              {/* Shot Details Form */}
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Visual Action & Subject Staging
                  </label>
                  <textarea
                    rows={2}
                    value={visualDescription}
                    onChange={(e) => setVisualDescription(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500/80 text-xs"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Spoken Dialogue / Key Audio
                  </label>
                  <input
                    type="text"
                    value={dialogue}
                    onChange={(e) => setDialogue(e.target.value)}
                    placeholder="Character lines or SFX cue..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500/80 text-xs font-serif italic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Lens</label>
                    <input
                      type="text"
                      value={lens}
                      onChange={(e) => setLens(e.target.value)}
                      placeholder="e.g. 35mm Anamorphic"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500/80 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Camera Movement</label>
                    <input
                      type="text"
                      value={cameraMovement}
                      onChange={(e) => setCameraMovement(e.target.value)}
                      placeholder="e.g. Dolly In"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500/80 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">
                    Lighting & Atmosphere
                  </label>
                  <input
                    type="text"
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    placeholder="e.g. Moody neon rim light with atmospheric rain haze"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500/80 text-xs"
                  />
                </div>

                <button
                  id="btn-save-shot-details"
                  onClick={handleSaveDetails}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Shot Metadata</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
