import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { handleFirestoreError, OperationType } from "./errors";
import { StoryboardProject } from "../types";

const COLLECTION_PATH = "projects";

/**
 * Sanitizes and prepares a storyboard project payload conforming to blueprint constraints.
 */
function sanitizeProjectData(project: StoryboardProject, userId: string, id: string) {
  return {
    id,
    userId,
    title: (project.title || "Untitled Project").slice(0, 300),
    logline: (project.logline || "").slice(0, 2000),
    stylePreset: (project.stylePreset || "cinematic_live_action").slice(0, 100),
    defaultImageSize: (project.defaultImageSize || "1K").slice(0, 20),
    defaultAspectRatio: (project.defaultAspectRatio || "16:9").slice(0, 20),
    rawScript: (project.rawScript || "").slice(0, 100000),
    scenes: (project.scenes || []).slice(0, 100).map((sc, scIdx) => ({
      sceneNumber: sc.sceneNumber || scIdx + 1,
      heading: (sc.heading || "").slice(0, 300),
      location: (sc.location || "").slice(0, 200),
      timeOfDay: (sc.timeOfDay || "").slice(0, 100),
      summary: (sc.summary || "").slice(0, 1000),
      shots: (sc.shots || []).slice(0, 50).map((sh, shIdx) => ({
        id: sh.id || `shot-${scIdx + 1}-${shIdx + 1}`,
        shotNumber: sh.shotNumber || shIdx + 1,
        shotType: (sh.shotType || "").slice(0, 100),
        cameraMovement: (sh.cameraMovement || "").slice(0, 100),
        lens: (sh.lens || "").slice(0, 100),
        visualDescription: (sh.visualDescription || "").slice(0, 3000),
        lightingAtmosphere: (sh.lightingAtmosphere || "").slice(0, 500),
        dialogueAudio: (sh.dialogueAudio || "").slice(0, 1000),
        directorNotes: (sh.directorNotes || "").slice(0, 1000),
        imagePrompt: (sh.imagePrompt || "").slice(0, 4000),
        imageUrl: sh.imageUrl || "",
        imageSize: sh.imageSize || "1K",
        aspectRatio: sh.aspectRatio || "16:9",
        modelUsed: sh.modelUsed || "",
      })),
    })),
    updatedAt: serverTimestamp(),
  };
}

/**
 * Save or update a storyboard project in Cloud Firestore
 */
export async function saveStoryboardProject(
  project: StoryboardProject,
  userId: string
): Promise<string> {
  const projectId = project.id || `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const path = `${COLLECTION_PATH}/${projectId}`;
  const docRef = doc(db, COLLECTION_PATH, projectId);

  try {
    const isUpdate = !!project.id;
    const sanitized = sanitizeProjectData(project, userId, projectId);

    if (isUpdate) {
      // Exclude createdAt to preserve immutable creation timestamp
      await setDoc(docRef, sanitized, { merge: true });
    } else {
      const createPayload = {
        ...sanitized,
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, createPayload);
    }

    return projectId;
  } catch (error) {
    handleFirestoreError(
      error,
      project.id ? OperationType.UPDATE : OperationType.CREATE,
      path
    );
  }
}

/**
 * Subscribe to real-time updates for all projects created by a specific user.
 */
export function subscribeUserProjects(
  userId: string,
  onData: (projects: StoryboardProject[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_PATH),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects: StoryboardProject[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        projects.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title || "Untitled",
          logline: data.logline || "",
          stylePreset: data.stylePreset || "cinematic_live_action",
          defaultImageSize: data.defaultImageSize || "1K",
          defaultAspectRatio: data.defaultAspectRatio || "16:9",
          rawScript: data.rawScript || "",
          scenes: data.scenes || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      onData(projects);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, COLLECTION_PATH);
    }
  );
}

/**
 * Delete a storyboard project from Firestore
 */
export async function deleteStoryboardProject(projectId: string): Promise<void> {
  const path = `${COLLECTION_PATH}/${projectId}`;
  try {
    await deleteDoc(doc(db, COLLECTION_PATH, projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
