import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { ScriptUploadSection } from "./components/ScriptUploadSection";
import { StoryboardView } from "./components/StoryboardView";
import { ShotModal } from "./components/ShotModal";
import { DirectorChatbot } from "./components/DirectorChatbot";
import { PresentationMode } from "./components/PresentationMode";
import { ProjectsGalleryModal } from "./components/ProjectsGalleryModal";
import { StoryboardProject, StoryboardShot, ImageResolution, AspectRatio } from "./types";
import { STYLE_PRESETS, SAMPLE_SCRIPTS } from "./data/sampleScripts";
import { useAuth } from "./firebase/authContext";
import { saveStoryboardProject } from "./firebase/projectsService";

export default function App() {
  const { currentUser, signInWithGoogle } = useAuth();

  // Script Input & Production Options State
  const [scriptText, setScriptText] = useState(SAMPLE_SCRIPTS[0].scriptText);
  const [selectedStyle, setSelectedStyle] = useState(SAMPLE_SCRIPTS[0].suggestedStyle);
  const [imageResolution, setImageResolution] = useState<ImageResolution>("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [shotCountPreference, setShotCountPreference] = useState<"condensed" | "standard" | "detailed">("standard");

  // Project & UI Views State
  const [project, setProject] = useState<StoryboardProject | null>(null);
  const [activeView, setActiveView] = useState<"script" | "storyboard" | "presentation">("script");
  const [isProcessingScript, setIsProcessingScript] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [activeModalShot, setActiveModalShot] = useState<StoryboardShot | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cloud Firestore Persistence State
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSaveSuccess, setCloudSaveSuccess] = useState(false);
  const [cloudNotification, setCloudNotification] = useState<string | null>(null);

  // 1. Script Breakdown API Handler
  const handleGenerateStoryboard = async () => {
    if (!scriptText.trim()) return;
    setIsProcessingScript(true);
    setErrorMessage(null);

    try {
      const selectedStyleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
      const styleName = selectedStyleObj ? selectedStyleObj.name : "Cinematic Live Action";

      const res = await fetch("/api/gemini/breakdown-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText,
          stylePreset: styleName,
          shotCountPreference,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process script breakdown.");
      }

      const data = await res.json();

      // Ensure IDs and default config exist on all shots
      let shotCounter = 1;
      const formattedScenes = (data.scenes || []).map((scene: any, sIdx: number) => ({
        ...scene,
        sceneNumber: scene.sceneNumber || sIdx + 1,
        shots: (scene.shots || []).map((shot: any) => ({
          ...shot,
          id: shot.id || `shot-${sIdx + 1}-${shotCounter++}`,
          imageSize: imageResolution,
          aspectRatio: aspectRatio,
        })),
      }));

      const newProject: StoryboardProject = {
        title: data.title || "Untitled Cinematic Storyboard",
        logline: data.logline || "Visual storyboard sequence generated from screenplay.",
        scenes: formattedScenes,
        stylePreset: selectedStyle,
        defaultImageSize: imageResolution,
        defaultAspectRatio: aspectRatio,
        rawScript: scriptText,
      };

      setProject(newProject);
      setActiveView("storyboard");

      // Auto-trigger generation for the first shot to give immediate visual feedback
      const firstShot = formattedScenes[0]?.shots[0];
      if (firstShot) {
        generateImageForShot(firstShot.id, newProject, firstShot.imagePrompt, imageResolution, aspectRatio);
      }
    } catch (err: any) {
      console.error("Error generating storyboard:", err);
      setErrorMessage(err.message || "Failed to parse script. Please check your connection and try again.");
    } finally {
      setIsProcessingScript(false);
    }
  };

  // 2. Single Shot Image Generation
  const generateImageForShot = async (
    shotId: string,
    currentProject: StoryboardProject | null = project,
    customPrompt?: string,
    customRes?: ImageResolution,
    customRatio?: AspectRatio,
    editBase64?: string
  ) => {
    if (!currentProject) return;

    const targetRes = customRes || currentProject.defaultImageSize || "1K";
    const targetRatio = customRatio || currentProject.defaultAspectRatio || "16:9";

    // Set shot generating state
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        scenes: prev.scenes.map((scene) => ({
          ...scene,
          shots: scene.shots.map((shot) =>
            shot.id === shotId
              ? { ...shot, isGenerating: true, error: undefined, imageSize: targetRes, aspectRatio: targetRatio }
              : shot
          ),
        })),
      };
    });

    try {
      // Find shot prompt
      let shotPrompt = customPrompt;
      if (!shotPrompt) {
        for (const scene of currentProject.scenes) {
          const found = scene.shots.find((s) => s.id === shotId);
          if (found) {
            shotPrompt = found.imagePrompt;
            break;
          }
        }
      }

      const styleObj = STYLE_PRESETS.find((s) => s.id === currentProject.stylePreset);
      const styleName = styleObj ? styleObj.name : "Cinematic 35mm Live Action";

      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: shotPrompt,
          imageSize: targetRes,
          aspectRatio: targetRatio,
          stylePreset: styleName,
          editImageBase64: editBase64,
          editPrompt: editBase64 ? customPrompt : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate image.");
      }

      const data = await res.json();

      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          scenes: prev.scenes.map((scene) => ({
            ...scene,
            shots: scene.shots.map((shot) =>
              shot.id === shotId
                ? {
                    ...shot,
                    imageUrl: data.imageUrl,
                    isGenerating: false,
                    imageSize: data.imageSize || targetRes,
                    aspectRatio: data.aspectRatio || targetRatio,
                    modelUsed: data.modelUsed,
                  }
                : shot
            ),
          })),
        };
      });

      // Update activeModalShot if open
      setActiveModalShot((prev) => {
        if (prev && prev.id === shotId) {
          return {
            ...prev,
            imageUrl: data.imageUrl,
            isGenerating: false,
            imageSize: data.imageSize || targetRes,
            aspectRatio: data.aspectRatio || targetRatio,
            modelUsed: data.modelUsed,
          };
        }
        return prev;
      });
    } catch (err: any) {
      console.error(`Error rendering shot ${shotId}:`, err);
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          scenes: prev.scenes.map((scene) => ({
            ...scene,
            shots: scene.shots.map((shot) =>
              shot.id === shotId
                ? { ...shot, isGenerating: false, error: err.message || "Failed to render frame" }
                : shot
            ),
          })),
        };
      });
    }
  };

  // 3. Render All Unrendered Shots in Sequence
  const handleGenerateAllMissing = async () => {
    if (!project || isGeneratingAll) return;
    setIsGeneratingAll(true);

    const shotsToGenerate: StoryboardShot[] = [];
    project.scenes.forEach((sc) => {
      sc.shots.forEach((sh) => {
        if (!sh.imageUrl && !sh.isGenerating) {
          shotsToGenerate.push(sh);
        }
      });
    });

    for (const shot of shotsToGenerate) {
      await generateImageForShot(shot.id, project, shot.imagePrompt, shot.imageSize || project.defaultImageSize);
    }

    setIsGeneratingAll(false);
  };

  // 4. Update Shot Metadata
  const handleUpdateShot = (updatedShot: StoryboardShot) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        scenes: prev.scenes.map((scene) => ({
          ...scene,
          shots: scene.shots.map((s) => (s.id === updatedShot.id ? updatedShot : s)),
        })),
      };
    });
    setActiveModalShot(updatedShot);
  };

  // 5. Add Custom Shot to Scene
  const handleAddShot = (sceneIndex: number) => {
    if (!project) return;
    const newShotNumber =
      project.scenes.reduce((acc, sc) => acc + sc.shots.length, 0) + 1;

    const newShot: StoryboardShot = {
      id: `custom-shot-${Date.now()}`,
      shotNumber: newShotNumber,
      shotType: "Medium Shot",
      cameraMovement: "Static",
      lens: "50mm Standard Prime",
      visualDescription: "New camera shot staging. Edit description or render visual.",
      lightingAtmosphere: "Natural ambient lighting",
      dialogueAudio: "",
      directorNotes: "Added manually by director.",
      imagePrompt: `Cinematic frame of a dramatic scene, 35mm film still, ${STYLE_PRESETS.find((s) => s.id === project.stylePreset)?.promptModifier || ""}`,
      imageSize: project.defaultImageSize,
      aspectRatio: project.defaultAspectRatio,
    };

    setProject((prev) => {
      if (!prev) return prev;
      const updatedScenes = [...prev.scenes];
      updatedScenes[sceneIndex] = {
        ...updatedScenes[sceneIndex],
        shots: [...updatedScenes[sceneIndex].shots, newShot],
      };
      return {
        ...prev,
        scenes: updatedScenes,
      };
    });
  };

  // 6. Save Storyboard Project to Firebase Cloud Firestore
  const handleSaveToCloud = async () => {
    if (!project) return;

    if (!currentUser) {
      try {
        await signInWithGoogle();
      } catch (err) {
        setErrorMessage("Please sign in with Google to save your project to Cloud Firestore.");
        return;
      }
    }

    if (!currentUser) return;

    setIsSavingToCloud(true);
    try {
      const savedId = await saveStoryboardProject(project, currentUser.uid);
      setProject((prev) => (prev ? { ...prev, id: savedId, userId: currentUser.uid } : prev));
      setCloudSaveSuccess(true);
      setCloudNotification("Saved storyboard project to Firebase Firestore successfully.");
      setTimeout(() => setCloudSaveSuccess(false), 4000);
      setTimeout(() => setCloudNotification(null), 5000);
    } catch (err: any) {
      console.error("Save to cloud error:", err);
      setErrorMessage("Could not save project to Cloud Firestore: " + (err.message || "Permission error"));
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // 7. Load Saved Project from Gallery
  const handleSelectProject = (loadedProject: StoryboardProject) => {
    setProject(loadedProject);
    if (loadedProject.rawScript) {
      setScriptText(loadedProject.rawScript);
    }
    if (loadedProject.stylePreset) {
      setSelectedStyle(loadedProject.stylePreset);
    }
    if (loadedProject.defaultImageSize) {
      setImageResolution(loadedProject.defaultImageSize);
    }
    if (loadedProject.defaultAspectRatio) {
      setAspectRatio(loadedProject.defaultAspectRatio);
    }
    setActiveView("storyboard");
    setCloudNotification(`Loaded "${loadedProject.title}" from Firebase Firestore.`);
    setTimeout(() => setCloudNotification(null), 4000);
  };

  // 8. Start New Project Reset
  const handleNewProject = () => {
    setProject(null);
    setScriptText("");
    setActiveView("script");
  };

  // 9. Export JSON
  const handleExportJSON = () => {
    if (!project) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.title.toLowerCase().replace(/\s+/g, "-")}-storyboard.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 10. Single Image Download
  const handleDownloadSingleImage = (shot: StoryboardShot) => {
    if (!shot.imageUrl) return;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = shot.imageUrl;
    downloadAnchor.download = `shot-${shot.shotNumber}-${shot.shotType.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 11. Download All Rendered Images
  const handleDownloadAllImages = () => {
    if (!project) return;
    project.scenes.forEach((sc) => {
      sc.shots.forEach((sh, idx) => {
        if (sh.imageUrl) {
          setTimeout(() => {
            handleDownloadSingleImage(sh);
          }, idx * 300);
        }
      });
    });
  };

  // 12. Print Handler
  const handlePrint = () => {
    window.print();
  };

  const hasShots = !!project && project.scenes.some((s) => s.shots.length > 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        project={project}
        activeView={activeView}
        setActiveView={setActiveView}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        onExportJSON={handleExportJSON}
        onPrint={handlePrint}
        onDownloadAllImages={handleDownloadAllImages}
        hasShots={hasShots}
        isGeneratingAll={isGeneratingAll}
        onGenerateAllMissing={handleGenerateAllMissing}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onSaveToCloud={handleSaveToCloud}
        isSavingToCloud={isSavingToCloud}
        cloudSaveSuccess={cloudSaveSuccess}
      />

      {/* Main Body View Container */}
      <main className="flex-1 pb-16">
        {/* Cloud Notification Banner */}
        {cloudNotification && (
          <div className="max-w-4xl mx-auto mt-4 px-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between shadow-lg animate-in fade-in">
              <span>{cloudNotification}</span>
              <button
                onClick={() => setCloudNotification(null)}
                className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-4 px-4">
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-sm text-red-200 flex items-center justify-between shadow-lg">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs px-2 py-1 rounded bg-red-900/80 hover:bg-red-800 text-red-100"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {activeView === "script" && (
          <ScriptUploadSection
            scriptText={scriptText}
            setScriptText={setScriptText}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            imageResolution={imageResolution}
            setImageResolution={setImageResolution}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            shotCountPreference={shotCountPreference}
            setShotCountPreference={setShotCountPreference}
            isProcessing={isProcessingScript}
            onGenerateStoryboard={handleGenerateStoryboard}
          />
        )}

        {activeView === "storyboard" && project && (
          <StoryboardView
            project={project}
            onGenerateImage={(shotId) => generateImageForShot(shotId)}
            onOpenModal={(shot) => setActiveModalShot(shot)}
            onDownloadImage={handleDownloadSingleImage}
            onGenerateAllMissing={handleGenerateAllMissing}
            isGeneratingAll={isGeneratingAll}
            onStartScreening={() => setActiveView("presentation")}
            onAddShot={handleAddShot}
            defaultResolution={imageResolution}
            setDefaultResolution={(res) => {
              setImageResolution(res);
              if (project) {
                setProject({ ...project, defaultImageSize: res });
              }
            }}
          />
        )}

        {activeView === "presentation" && project && (
          <PresentationMode
            project={project}
            onClose={() => setActiveView("storyboard")}
          />
        )}
      </main>

      {/* Shot Inspector & Refinement Lightbox Modal */}
      {activeModalShot && (
        <ShotModal
          shot={activeModalShot}
          onClose={() => setActiveModalShot(null)}
          onUpdateShot={handleUpdateShot}
          onRegenerateImage={(id, prompt, res, ratio, editBase64) =>
            generateImageForShot(id, project, prompt, res, ratio, editBase64)
          }
          onDownloadImage={handleDownloadSingleImage}
        />
      )}

      {/* Multi-turn AI Director Chatbot Drawer */}
      <DirectorChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        project={project}
      />

      {/* Firebase Cloud Storyboard Projects Gallery */}
      <ProjectsGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        currentProjectId={project?.id}
      />
    </div>
  );
}
