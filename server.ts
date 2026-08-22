import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware with large payload support for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialization helper for Google GenAI SDK
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not set. Gemini features will require API key.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Script Breakdown API endpoint (Extracts scenes, shots, camera specs & image prompts)
app.post("/api/gemini/breakdown-script", async (req, res) => {
  try {
    const { scriptText, stylePreset, shotCountPreference } = req.body;

    if (!scriptText || typeof scriptText !== "string" || !scriptText.trim()) {
      return res.status(400).json({ error: "Script text is required." });
    }

    const ai = getAI();

    const systemInstruction = `You are an elite Hollywood Director and Storyboard Artist Supervisor.
Analyze the provided screenplay or script excerpt and break it down into a dynamic sequence of cinematic storyboard shots.

Guidelines:
1. Divide the script into logical scenes and granular camera shots that visually tell the story with cinematic pacing.
2. For each shot, provide precise cinematography details: shot type (Wide, Medium, Close-Up, Low Angle, Over-the-Shoulder, POV, etc.), camera movement, lens choice, lighting mood, sound/dialogue, and director's notes.
3. For each shot, generate a rich, photorealistic, and highly evocative 'imagePrompt' tailored for AI image generation. The prompt must explicitly describe subject staging, facial expression/body language, lighting color/direction, atmosphere (dust, rain, lens flare, volumetric fog), color grading, and framing. Incorporate the requested visual style: "${stylePreset || "Cinematic Live Action Film"}".
4. Ensure continuity between shots in the same scene.
5. Create roughly ${shotCountPreference === "condensed" ? "3 to 4" : shotCountPreference === "detailed" ? "7 to 10" : "4 to 6"} key storyboard shots across the scene(s).`;

    const prompt = `Please parse this script into a structured storyboard breakdown:\n\n${scriptText.slice(0, 15000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the project or scene" },
            logline: { type: Type.STRING, description: "One sentence summary of the scene's emotional beat and action" },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  heading: { type: Type.STRING, description: "e.g. EXT. RAIN-DRENCHED ALLEY - NIGHT" },
                  location: { type: Type.STRING, description: "EXTERIOR or INTERIOR" },
                  timeOfDay: { type: Type.STRING, description: "DAY, NIGHT, DUSK, DAWN, GOLDEN HOUR" },
                  summary: { type: Type.STRING },
                  shots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        shotNumber: { type: Type.INTEGER },
                        shotType: { type: Type.STRING, description: "e.g. Wide Establishing Shot, Close-Up, Low Angle, Dutch Angle" },
                        cameraMovement: { type: Type.STRING, description: "e.g. Slow Dolly In, Static, Handheld Shake, Pan Right" },
                        lens: { type: Type.STRING, description: "e.g. 35mm Anamorphic, 85mm Prime, 24mm Ultra Wide" },
                        visualDescription: { type: Type.STRING, description: "What is physically happening on screen" },
                        lightingAtmosphere: { type: Type.STRING, description: "Lighting scheme and atmospheric mood" },
                        dialogueAudio: { type: Type.STRING, description: "Spoken dialogue, voiceover or key SFX" },
                        directorNotes: { type: Type.STRING, description: "Emotional beat, pacing or actor guidance" },
                        imagePrompt: { type: Type.STRING, description: "Rich, descriptive prompt optimized for AI image generation" },
                      },
                      required: [
                        "shotNumber",
                        "shotType",
                        "cameraMovement",
                        "lens",
                        "visualDescription",
                        "lightingAtmosphere",
                        "imagePrompt",
                      ],
                    },
                  },
                },
                required: ["sceneNumber", "heading", "shots"],
              },
            },
          },
          required: ["title", "logline", "scenes"],
        },
      },
    });

    const textOutput = response.text?.trim();
    if (!textOutput) {
      throw new Error("No response generated from Gemini model.");
    }

    const parsed = JSON.parse(textOutput);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/breakdown-script:", error);
    return res.status(500).json({
      error: error.message || "Failed to breakdown script into storyboard.",
    });
  }
});

// 2. High-Quality Image Generation API endpoint using gemini-3-pro-image-preview
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const {
      prompt,
      imageSize = "1K", // Affordance for 1K, 2K, 4K
      aspectRatio = "16:9", // 16:9 standard cinematic storyboard, 4:3, 1:1, 9:16
      stylePreset = "Cinematic Live Action",
      editImageBase64,
      editPrompt,
    } = req.body;

    if (!prompt && !editPrompt) {
      return res.status(400).json({ error: "Prompt is required for image generation." });
    }

    const ai = getAI();

    // Enhance prompt with style preset if not already present
    let finalPrompt = editPrompt || prompt;
    if (stylePreset && !finalPrompt.toLowerCase().includes(stylePreset.toLowerCase())) {
      finalPrompt = `${finalPrompt}, visual style: ${stylePreset}, cinematic composition, 8k render, masterpiece lighting, highly detailed film still, photorealistic`;
    }

    // Supported models in order of user requirement: gemini-3-pro-image-preview / gemini-3-pro-image / gemini-3.1-flash-image
    const preferredModels = [
      "gemini-3-pro-image-preview",
      "gemini-3-pro-image",
      "gemini-3.1-flash-image",
    ];

    let lastError: any = null;
    let imageUrl = "";
    let usedModel = "";

    // Prepare contents: text + optional image for editing
    const parts: any[] = [];

    if (editImageBase64) {
      // Clean base64 string
      const cleanBase64 = editImageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64,
        },
      });
      parts.push({
        text: `Modify the image according to this instruction: ${finalPrompt}. Maintain cinematic storyboard continuity and aesthetic fidelity.`,
      });
    } else {
      parts.push({
        text: finalPrompt,
      });
    }

    // Validate imageSize for Gemini API
    const validSizes = ["512px", "1K", "2K", "4K"];
    const targetSize = validSizes.includes(imageSize) ? imageSize : "1K";

    // Validate aspectRatio
    const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"];
    const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "16:9";

    for (const modelName of preferredModels) {
      try {
        console.log(`Attempting image generation with model: ${modelName}, size: ${targetSize}, ratio: ${targetAspectRatio}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config: {
            imageConfig: {
              aspectRatio: targetAspectRatio,
              imageSize: targetSize,
            },
          },
        });

        // Search through parts for inlineData
        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              imageUrl = `data:${mime};base64,${part.inlineData.data}`;
              usedModel = modelName;
              break;
            }
          }
        }

        if (imageUrl) {
          break; // successfully generated
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message || err);
        lastError = err;
      }
    }

    if (!imageUrl) {
      throw lastError || new Error("Failed to extract generated image from Gemini response.");
    }

    return res.json({
      imageUrl,
      modelUsed: usedModel,
      imageSize: targetSize,
      aspectRatio: targetAspectRatio,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-image:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate storyboard image.",
    });
  }
});

// 3. Multi-turn AI Chatbot endpoint for Director, Cinematographer & Fast Assistant
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const {
      messages = [],
      roleType = "director",
      context = {},
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array cannot be empty." });
    }

    const ai = getAI();

    // Select model according to role complexity as mandated:
    // - gemini-3.1-pro-preview for particularly complex tasks (Deep Director & Structural Analysis)
    // - gemini-3.5-flash for general tasks (Cinematography & Visual Lighting Advice)
    // - gemini-3.1-flash-lite for tasks that should happen fast (Quick tweaks & rapid prompt generator)
    let selectedModel = "gemini-3.5-flash";
    let roleSystemInstruction = "";

    if (roleType === "director_complex" || roleType === "director") {
      selectedModel = "gemini-3.1-pro-preview";
      roleSystemInstruction = `You are a visionary film director and veteran script doctor.
Your goal is to advise the user on script structure, dramatic beats, emotional subtext, shot pacing, character arcs, and creative direction.
Offer constructive, specific filmmaking advice. When suggesting new storyboard shots or scene revisions, format them clearly with:
- Shot Type & Camera Movement
- Lighting & Mood
- Recommended Visual Prompt for Image Generation

Active Project Context:
${context.title ? `Project Title: ${context.title}` : ""}
${context.logline ? `Logline: ${context.logline}` : ""}
${context.activeScene ? `Current Active Scene: ${JSON.stringify(context.activeScene)}` : ""}
${context.scriptExcerpt ? `Script Excerpt: ${context.scriptExcerpt.slice(0, 2000)}` : ""}`;
    } else if (roleType === "cinematographer") {
      selectedModel = "gemini-3.5-flash";
      roleSystemInstruction = `You are a world-class Director of Photography (Cinematographer) and lighting master.
Your specialty is focal lengths, anamorphic lenses, 3-point lighting setups, chiaroscuro, volumetric haze, color palettes, Dutch angles, gimbal vs handheld camera motion, and creating breathtaking visual compositions.
When giving recommendations, provide precise visual prompt suggestions and camera specs that can be used directly in AI storyboard image generation.

Active Project Context:
${context.title ? `Project Title: ${context.title}` : ""}
${context.stylePreset ? `Visual Style Preset: ${context.stylePreset}` : ""}`;
    } else {
      // Fast Assistant role
      selectedModel = "gemini-3.1-flash-lite";
      roleSystemInstruction = `You are a rapid-response storyboard assistant.
Give concise, punchy suggestions for shot descriptions, lighting tags, prompt polish, and quick camera angles. Keep responses crisp and immediately actionable.`;
    }

    // Format conversation history for Gemini SDK
    // Convert previous user/model messages into contents format
    const contents: any[] = [];

    // Filter and map messages
    for (const msg of messages) {
      if (!msg.text || !msg.text.trim()) continue;
      const role = msg.role === "user" ? "user" : "model";
      contents.push({
        role,
        parts: [{ text: msg.text }],
      });
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: "No valid message contents found." });
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: roleSystemInstruction,
          temperature: 0.7,
        },
      });
    } catch (primaryErr: any) {
      console.warn(`Chat call with ${selectedModel} failed, trying fallback to gemini-3.5-flash:`, primaryErr.message);
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: roleSystemInstruction,
          temperature: 0.7,
        },
      });
      selectedModel = "gemini-3.5-flash";
    }

    const replyText = response.text || "I've reviewed your request. How else can I assist with your storyboard sequence?";

    return res.json({
      role: "model",
      text: replyText,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    return res.status(500).json({
      error: error.message || "Failed to process chat conversation.",
    });
  }
});

// Setup Vite middleware for development or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CineBoard Storyboard server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
