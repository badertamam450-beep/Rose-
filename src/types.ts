export type ImageResolution = "1K" | "2K" | "4K" | "512px";
export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16";

export interface StoryboardShot {
  id: string;
  shotNumber: number;
  shotType: string;
  cameraMovement: string;
  lens: string;
  visualDescription: string;
  lightingAtmosphere: string;
  dialogueAudio?: string;
  directorNotes?: string;
  imagePrompt: string;
  imageUrl?: string;
  isGenerating?: boolean;
  error?: string;
  imageSize?: ImageResolution;
  aspectRatio?: AspectRatio;
  modelUsed?: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  heading: string;
  location?: string;
  timeOfDay?: string;
  summary?: string;
  shots: StoryboardShot[];
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface StoryboardProject {
  id?: string;
  userId?: string;
  title: string;
  logline: string;
  scenes: StoryboardScene[];
  stylePreset: string;
  defaultImageSize: ImageResolution;
  defaultAspectRatio: AspectRatio;
  rawScript?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type ChatRoleType = "director" | "cinematographer" | "fast_assistant";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  modelUsed?: string;
  roleType?: ChatRoleType;
}

export interface StylePresetOption {
  id: string;
  name: string;
  category: string;
  description: string;
  badgeColor: string;
  promptModifier: string;
}
