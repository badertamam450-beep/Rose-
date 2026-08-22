import React from "react";
import {
  Camera,
  Maximize2,
  RefreshCw,
  Edit3,
  Download,
  Sparkles,
  Volume2,
  FileText,
  AlertCircle,
  Clock,
  Compass,
} from "lucide-react";
import { StoryboardShot, ImageResolution } from "../types";

interface StoryboardShotCardProps {
  shot: StoryboardShot;
  sceneIndex: number;
  shotIndex: number;
  onGenerateImage: (shotId: string) => void;
  onOpenModal: (shot: StoryboardShot) => void;
  onDownloadImage: (shot: StoryboardShot) => void;
  defaultResolution: ImageResolution;
}

export const StoryboardShotCard: React.FC<StoryboardShotCardProps> = ({
  shot,
  sceneIndex,
  shotIndex,
  onGenerateImage,
  onOpenModal,
  onDownloadImage,
  defaultResolution,
}) => {
  const currentRes = shot.imageSize || defaultResolution;

  return (
    <div
      id={`shot-card-${shot.id}`}
      className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700/80 transition-all flex flex-col group"
    >
      {/* Top Shot Header Strip */}
      <div className="bg-zinc-950/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-xs border border-amber-500/30">
            {shot.shotNumber || shotIndex + 1}
          </span>
          <span className="font-semibold text-zinc-200 truncate">
            {shot.shotType || "Standard Shot"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
            {shot.lens || "35mm"}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono hidden sm:inline">
            {shot.cameraMovement || "Static"}
          </span>
        </div>
      </div>

      {/* Frame Visual / Image Container */}
      <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
        {shot.imageUrl ? (
          <>
            <img
              src={shot.imageUrl}
              alt={`Shot ${shot.shotNumber}: ${shot.visualDescription}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Image Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                {currentRes} • {shot.aspectRatio || "16:9"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  id={`btn-enlarge-shot-${shot.id}`}
                  onClick={() => onOpenModal(shot)}
                  className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-amber-300 border border-zinc-700/80 transition-colors shadow"
                  title="Enlarge & Edit Shot"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`btn-download-shot-${shot.id}`}
                  onClick={() => onDownloadImage(shot)}
                  className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-amber-300 border border-zinc-700/80 transition-colors shadow"
                  title="Download Frame Image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  id={`btn-regenerate-shot-${shot.id}`}
                  onClick={() => onGenerateImage(shot.id)}
                  disabled={shot.isGenerating}
                  className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-amber-300 border border-zinc-700/80 transition-colors shadow"
                  title="Regenerate Frame Image"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${shot.isGenerating ? "animate-spin text-amber-400" : ""}`} />
                </button>
              </div>
            </div>
          </>
        ) : shot.isGenerating ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-400">Rendering Frame ({currentRes})...</p>
              <p className="text-[10px] text-zinc-500">Gemini 3 Pro Image Generating Visuals</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 w-full">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-xs">
              <p className="text-xs text-zinc-400">Frame visual ready for generation</p>
              <button
                id={`btn-generate-shot-image-${shot.id}`}
                onClick={() => onGenerateImage(shot.id)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Render Frame ({currentRes})</span>
              </button>
            </div>
          </div>
        )}

        {shot.error && (
          <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-red-950/90 border border-red-800/80 text-[11px] text-red-200 flex items-center gap-1.5 backdrop-blur-sm">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{shot.error}</span>
          </div>
        )}
      </div>

      {/* Shot Metadata & Director Specs */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
        <div className="space-y-2.5">
          {/* Visual Action Description */}
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1 mb-1">
              <FileText className="w-3 h-3 text-amber-500/70" />
              Action / Staging
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed line-clamp-3">
              {shot.visualDescription}
            </p>
          </div>

          {/* Spoken Dialogue / Voiceover or SFX */}
          {shot.dialogueAudio && (
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider flex items-center gap-1 mb-0.5">
                <Volume2 className="w-3 h-3" />
                Dialogue / SFX
              </div>
              <p className="text-zinc-300 font-serif italic text-xs">
                "{shot.dialogueAudio}"
              </p>
            </div>
          )}

          {/* Lighting & Atmosphere */}
          <div className="flex items-start gap-1.5 text-[11px] text-zinc-400">
            <Compass className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong className="text-zinc-300">Atmosphere:</strong> {shot.lightingAtmosphere}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="truncate max-w-[140px]">
            {shot.directorNotes ? `Note: ${shot.directorNotes}` : "Shot sequence ready"}
          </span>
          <button
            id={`btn-open-shot-details-${shot.id}`}
            onClick={() => onOpenModal(shot)}
            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
