import React, { useState } from "react";
import {
  Film,
  Sparkles,
  MessageSquareText,
  Play,
  Printer,
  Download,
  FileCode2,
  RefreshCw,
  Cloud,
  Check,
  FolderOpen,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { StoryboardProject } from "../types";
import { useAuth } from "../firebase/authContext";

interface NavbarProps {
  project: StoryboardProject | null;
  activeView: "script" | "storyboard" | "presentation";
  setActiveView: (view: "script" | "storyboard" | "presentation") => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  onExportJSON: () => void;
  onPrint: () => void;
  onDownloadAllImages: () => void;
  hasShots: boolean;
  isGeneratingAll: boolean;
  onGenerateAllMissing: () => void;
  onOpenGallery: () => void;
  onSaveToCloud: () => Promise<void>;
  isSavingToCloud: boolean;
  cloudSaveSuccess: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  activeView,
  setActiveView,
  isChatOpen,
  setIsChatOpen,
  onExportJSON,
  onPrint,
  onDownloadAllImages,
  hasShots,
  isGeneratingAll,
  onGenerateAllMissing,
  onOpenGallery,
  onSaveToCloud,
  isSavingToCloud,
  cloudSaveSuccess,
}) => {
  const { currentUser, signInWithGoogle, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3 flex items-center justify-between transition-all">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
          <Film className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-zinc-100 text-sm md:text-base tracking-tight font-serif truncate">
              CineBoard AI
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline-block">
              Firestore Cloud
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-[180px] sm:max-w-xs md:max-w-md truncate">
            {project?.title ? project.title : "Script to Cinematic Storyboard Generator"}
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <div className="hidden md:flex items-center p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
        <button
          id="nav-tab-script"
          onClick={() => setActiveView("script")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeView === "script"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          1. Script Input
        </button>
        <button
          id="nav-tab-storyboard"
          onClick={() => setActiveView("storyboard")}
          disabled={!hasShots}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeView === "storyboard"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : hasShots
              ? "text-zinc-400 hover:text-zinc-200"
              : "text-zinc-600 cursor-not-allowed"
          }`}
        >
          <span>2. Storyboard</span>
          {hasShots && project?.scenes && (
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-bold">
              {project.scenes.reduce((acc, s) => acc + s.shots.length, 0)}
            </span>
          )}
        </button>
        <button
          id="nav-tab-presentation"
          onClick={() => setActiveView("presentation")}
          disabled={!hasShots}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
            activeView === "presentation"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : hasShots
              ? "text-zinc-400 hover:text-zinc-200"
              : "text-zinc-600 cursor-not-allowed"
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Screening</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Cloud Projects Gallery */}
        <button
          id="btn-open-projects-gallery"
          onClick={onOpenGallery}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          title="Open Saved Storyboards from Firestore"
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">My Projects</span>
        </button>

        {/* Save to Cloud (Firestore) Button */}
        {hasShots && (
          <button
            id="btn-save-to-cloud"
            onClick={onSaveToCloud}
            disabled={isSavingToCloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
              cloudSaveSuccess
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/80 shadow-sm"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
            }`}
            title="Save storyboard sequence to Firebase Firestore"
          >
            {isSavingToCloud ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : cloudSaveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Saved in Cloud</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Save to Cloud</span>
              </>
            )}
          </button>
        )}

        {hasShots && (
          <>
            <button
              id="btn-generate-all"
              onClick={onGenerateAllMissing}
              disabled={isGeneratingAll}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 transition-colors"
              title="Generate missing shot visuals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAll ? "animate-spin" : ""}`} />
              <span>{isGeneratingAll ? "Rendering..." : "Render All"}</span>
            </button>

            <button
              id="btn-download-images"
              onClick={onDownloadAllImages}
              className="hidden sm:flex p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-lg border border-zinc-800 transition-colors"
              title="Download all frames"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-print-sheets"
              onClick={onPrint}
              className="hidden lg:flex p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-lg border border-zinc-800 transition-colors"
              title="Print Storyboard Sheets"
            >
              <Printer className="w-4 h-4" />
            </button>
          </>
        )}

        {/* AI Director Assistant Drawer Toggle */}
        <button
          id="btn-toggle-ai-chat"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isChatOpen
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold border-amber-400 shadow-md"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Director</span>
        </button>

        {/* Firebase Authentication Button / Avatar */}
        <div className="relative">
          {currentUser ? (
            <button
              id="btn-user-avatar-menu"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              title={currentUser.displayName || currentUser.email || "Account"}
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </button>
          ) : (
            <button
              id="btn-nav-signin"
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* User Dropdown Menu */}
          {showUserMenu && currentUser && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                <p className="text-xs font-semibold text-zinc-100 truncate">
                  {currentUser.displayName || "Director"}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono truncate">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenGallery();
                }}
                className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl flex items-center gap-2 transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>My Storyboards</span>
              </button>

              <button
                onClick={async () => {
                  setShowUserMenu(false);
                  await signOutUser();
                }}
                className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-950/40 rounded-xl flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
