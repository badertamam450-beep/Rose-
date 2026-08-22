import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  X,
  Plus,
  Trash2,
  Clock,
  Film,
  Sparkles,
  ChevronRight,
  Cloud,
  Layers,
  AlertCircle,
} from "lucide-react";
import { StoryboardProject } from "../types";
import { subscribeUserProjects, deleteStoryboardProject } from "../firebase/projectsService";
import { useAuth } from "../firebase/authContext";

interface ProjectsGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: StoryboardProject) => void;
  onNewProject: () => void;
  currentProjectId?: string;
}

export const ProjectsGalleryModal: React.FC<ProjectsGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onNewProject,
  currentProjectId,
}) => {
  const { currentUser, signInWithGoogle } = useAuth();
  const [projects, setProjects] = useState<StoryboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (!currentUser) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserProjects(
      currentUser.uid,
      (userProjects) => {
        setProjects(userProjects);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load projects:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this storyboard project from Cloud storage?")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteStoryboardProject(id);
    } catch (err) {
      console.error("Delete project error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div
        id="projects-gallery-modal"
        className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 font-serif">Cloud Storyboard Projects</h2>
              <p className="text-xs text-zinc-400">
                Persistent Firebase Firestore database storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                id="btn-gallery-new-project"
                onClick={() => {
                  onNewProject();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}
            <button
              id="btn-close-gallery"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentUser ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
                <Cloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100 mb-1">Sign In to Access Cloud Saves</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sign in with your Google account to automatically synchronize and persist your scripts, scenes, and generated 4K storyboard frames to your Firebase Cloud database.
                </p>
              </div>
              <button
                onClick={signInWithGoogle}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Sign In with Google</span>
              </button>
            </div>
          ) : loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-zinc-400 font-mono">Syncing Firestore database...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">No Saved Storyboards Yet</h3>
              <p className="text-xs text-zinc-500">
                Generate a storyboard sequence from any script and click "Save to Cloud" to store it securely in your Firestore database.
              </p>
              <button
                onClick={() => {
                  onNewProject();
                  onClose();
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
              >
                Create First Storyboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => {
                const totalShots = proj.scenes.reduce((acc, sc) => acc + (sc.shots?.length || 0), 0);
                const firstShotWithImage = proj.scenes
                  .flatMap((s) => s.shots)
                  .find((sh) => sh?.imageUrl);
                const isCurrent = proj.id === currentProjectId;

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className={`group relative bg-zinc-900/60 hover:bg-zinc-900 border rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isCurrent
                        ? "border-amber-500/80 ring-1 ring-amber-500/40 bg-zinc-900/90"
                        : "border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      {/* Thumbnail Preview & Info */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-24 h-16 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                          {firstShotWithImage?.imageUrl ? (
                            <img
                              src={firstShotWithImage.imageUrl}
                              alt={proj.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Film className="w-6 h-6 text-zinc-700" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-zinc-100 font-serif truncate group-hover:text-amber-300 transition-colors">
                              {proj.title}
                            </h3>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {proj.logline || "No logline description provided."}
                          </p>
                        </div>
                      </div>

                      {/* Metadata Chips */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-400 mb-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-zinc-300">
                          {proj.scenes.length} {proj.scenes.length === 1 ? "Scene" : "Scenes"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-zinc-300">
                          {totalShots} {totalShots === 1 ? "Shot" : "Shots"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-amber-400/90">
                          {proj.defaultImageSize || "1K"} • {proj.defaultAspectRatio || "16:9"}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>
                          {proj.updatedAt?.seconds
                            ? new Date(proj.updatedAt.seconds * 1000).toLocaleDateString()
                            : "Saved"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDelete(e, proj.id!)}
                          disabled={deletingId === proj.id}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Delete from Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="flex items-center gap-0.5 text-amber-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
