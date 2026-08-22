import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Film,
  Camera,
  Volume2,
} from "lucide-react";
import { StoryboardProject, StoryboardShot } from "../types";

interface PresentationModeProps {
  project: StoryboardProject;
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  project,
  onClose,
}) => {
  // Flatten all shots across all scenes for linear playback
  const allShots: { shot: StoryboardShot; sceneHeading: string; sceneNum: number }[] = [];
  project.scenes.forEach((sc, scIdx) => {
    sc.shots.forEach((sh) => {
      allShots.push({
        shot: sh,
        sceneHeading: sc.heading || `SCENE ${scIdx + 1}`,
        sceneNum: sc.sceneNumber || scIdx + 1,
      });
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);

  const currentItem = allShots[currentIndex];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allShots.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, allShots.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(prev + 1, allShots.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allShots.length, onClose]);

  if (!currentItem) return null;

  const { shot, sceneHeading, sceneNum } = currentItem;

  return (
    <div
      id="presentation-screening-room"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none"
    >
      {/* Top Floating Control Bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs border border-amber-500/30">
            {currentIndex + 1}/{allShots.length}
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 font-serif tracking-wide truncate max-w-md">
              {project.title}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              SCENE {sceneNum}: {sceneHeading}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showCaptions
                ? "bg-zinc-800 text-amber-300 border-zinc-700"
                : "bg-black/50 text-zinc-500 border-zinc-800 hover:text-zinc-300"
            }`}
          >
            Subtitles & Info
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition-colors shadow"
            title={isPlaying ? "Pause Slideshow" : "Auto-Play Slideshow"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            id="btn-close-presentation"
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Screening Frame */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-8">
        {/* Visual Frame */}
        <div className="relative max-w-6xl w-full aspect-video bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex items-center justify-center">
          {shot.imageUrl ? (
            <img
              src={shot.imageUrl}
              alt={`Shot ${shot.shotNumber}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <Camera className="w-12 h-12 text-zinc-700" />
              <p className="text-sm text-zinc-400">Frame visual not yet rendered.</p>
            </div>
          )}

          {/* Subtitle / Dialogue Cinematic Overlay */}
          {showCaptions && (
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col items-center text-center space-y-2">
              {shot.dialogueAudio ? (
                <p className="text-amber-300 font-serif italic text-base sm:text-xl font-medium tracking-wide drop-shadow-md max-w-3xl">
                  "{shot.dialogueAudio}"
                </p>
              ) : (
                <p className="text-zinc-200 text-sm sm:text-base max-w-3xl leading-relaxed">
                  {shot.visualDescription}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                <span className="px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono">
                  {shot.shotType}
                </span>
                <span>•</span>
                <span className="font-mono text-zinc-300">{shot.lens}</span>
                <span>•</span>
                <span className="font-mono text-zinc-300">{shot.cameraMovement}</span>
              </div>
            </div>
          )}
        </div>

        {/* Previous Button */}
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-amber-400 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, allShots.length - 1))}
          disabled={currentIndex === allShots.length - 1}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-amber-400 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Shot Timeline Scrubber */}
      <div className="px-6 py-4 bg-gradient-to-t from-black/95 to-transparent flex items-center gap-3 overflow-x-auto no-scrollbar z-20">
        {allShots.map((item, idx) => (
          <button
            key={item.shot.id || idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-20 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
              currentIndex === idx
                ? "border-amber-400 scale-105 shadow-md shadow-amber-500/30"
                : "border-zinc-800 opacity-60 hover:opacity-100"
            }`}
          >
            {item.shot.imageUrl ? (
              <img
                src={item.shot.imageUrl}
                alt={`Thumb ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
                #{idx + 1}
              </div>
            )}
            <div className="absolute top-0.5 left-1 text-[9px] font-mono font-bold text-white bg-black/70 px-1 rounded">
              {idx + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
