import React, { useState } from "react";
import {
  Film,
  Sparkles,
  RefreshCw,
  Plus,
  Play,
  Download,
  Filter,
  CheckCircle,
  Eye,
  Sliders,
} from "lucide-react";
import { StoryboardProject, StoryboardShot, ImageResolution, AspectRatio } from "../types";
import { StoryboardShotCard } from "./StoryboardShotCard";

interface StoryboardViewProps {
  project: StoryboardProject;
  onGenerateImage: (shotId: string) => void;
  onOpenModal: (shot: StoryboardShot) => void;
  onDownloadImage: (shot: StoryboardShot) => void;
  onGenerateAllMissing: () => void;
  isGeneratingAll: boolean;
  onStartScreening: () => void;
  onAddShot: (sceneIndex: number) => void;
  defaultResolution: ImageResolution;
  setDefaultResolution: (res: ImageResolution) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  onGenerateImage,
  onOpenModal,
  onDownloadImage,
  onGenerateAllMissing,
  isGeneratingAll,
  onStartScreening,
  onAddShot,
  defaultResolution,
  setDefaultResolution,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "rendered" | "unrendered">("all");

  const totalShots = project.scenes.reduce((acc, scene) => acc + scene.shots.length, 0);
  const renderedShots = project.scenes.reduce(
    (acc, scene) => acc + scene.shots.filter((s) => s.imageUrl).length,
    0
  );
  const unrenderedShots = totalShots - renderedShots;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Project Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Film className="w-3.5 h-3.5" />
              <span>Storyboard Sequence Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-100 font-serif">
              {project.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed italic">
              "{project.logline}"
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 shrink-0">
            <div className="text-center px-3 border-r border-zinc-800">
              <div className="text-xs text-zinc-500 uppercase font-semibold">Total Shots</div>
              <div className="text-xl font-bold text-zinc-100 font-mono">{totalShots}</div>
            </div>
            <div className="text-center px-3 border-r border-zinc-800">
              <div className="text-xs text-zinc-500 uppercase font-semibold">Rendered</div>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {renderedShots}/{totalShots}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pl-2">
              <button
                id="btn-screening-start"
                onClick={onStartScreening}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Screen Sequence</span>
              </button>
              {unrenderedShots > 0 && (
                <button
                  id="btn-bulk-render"
                  onClick={onGenerateAllMissing}
                  disabled={isGeneratingAll}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-medium text-xs border border-zinc-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAll ? "animate-spin" : ""}`} />
                  <span>Render {unrenderedShots} Remaining</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Global Resolution Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Default Render Resolution:
            </span>
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              {(["1K", "2K", "4K"] as ImageResolution[]).map((res) => (
                <button
                  key={res}
                  id={`res-pill-${res}`}
                  onClick={() => setDefaultResolution(res)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    defaultResolution === res
                      ? "bg-amber-500 text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              id="filter-all-shots"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filterMode === "all"
                  ? "bg-zinc-800 text-amber-300"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Shots ({totalShots})
            </button>
            <button
              id="filter-rendered-shots"
              onClick={() => setFilterMode("rendered")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filterMode === "rendered"
                  ? "bg-zinc-800 text-amber-300"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Rendered ({renderedShots})
            </button>
            <button
              id="filter-unrendered-shots"
              onClick={() => setFilterMode("unrendered")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filterMode === "unrendered"
                  ? "bg-zinc-800 text-amber-300"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Pending ({unrenderedShots})
            </button>
          </div>
        </div>
      </div>

      {/* Scenes List */}
      <div className="space-y-12">
        {project.scenes.map((scene, sceneIndex) => {
          const visibleShots = scene.shots.filter((shot) => {
            if (filterMode === "rendered") return !!shot.imageUrl;
            if (filterMode === "unrendered") return !shot.imageUrl;
            return true;
          });

          if (visibleShots.length === 0 && filterMode !== "all") {
            return null;
          }

          return (
            <div key={scene.sceneNumber || sceneIndex} className="space-y-5">
              {/* Scene Heading Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-serif font-bold text-sm flex items-center justify-center border border-amber-500/20">
                    SC {scene.sceneNumber || sceneIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-wide font-mono">
                      {scene.heading || `SCENE ${sceneIndex + 1}`}
                    </h3>
                    {scene.summary && (
                      <p className="text-xs text-zinc-400">{scene.summary}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {scene.timeOfDay && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-zinc-900 text-amber-400/90 border border-zinc-800">
                      {scene.timeOfDay}
                    </span>
                  )}
                  {scene.location && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {scene.location}
                    </span>
                  )}
                  <button
                    id={`btn-add-shot-scene-${sceneIndex}`}
                    onClick={() => onAddShot(sceneIndex)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 border border-zinc-800 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Add custom shot to this scene"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Shot</span>
                  </button>
                </div>
              </div>

              {/* Shot Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleShots.map((shot, shotIndex) => (
                  <StoryboardShotCard
                    key={shot.id}
                    shot={shot}
                    sceneIndex={sceneIndex}
                    shotIndex={shotIndex}
                    onGenerateImage={onGenerateImage}
                    onOpenModal={onOpenModal}
                    onDownloadImage={onDownloadImage}
                    defaultResolution={defaultResolution}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
