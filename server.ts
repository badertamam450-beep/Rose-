import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "My Rose Dental", timestamp: new Date().toISOString() });
});

// Dental AI Clinical Consultation API for Dr. Malek
app.post("/api/gemini/dental-consult", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt string" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return a professional simulation response if API key is not yet set
      return res.json({
        reply: `مرحباً دكتور مالك. بناءً على استشارتك: "${prompt}"\n\n- التشخيص السريري المقترح: متابعة دقيقة لحالة الأنسجة اللثوية وتطبيق بروتوكول التخدير الموضعي المناسب.\n- الخطة العلاجية: إجراء تنظيف عميق وجلسة تقييم شعاعي (CBCT/Panoramic) قبل اتخاذ القرار الجراحي.\n- الملاحظات: يُرجى تزويد النظام بمزيد من التفاصيل أو صور الأشعة لتقديم تحليل أكثر دقة.`,
        isSimulated: true,
      });
    }

    const systemInstruction = `أنت المساعد الطبي والاستشاري السريري المتخصص والمحترف في طب وجراحة الفم والأسنان للدكتور مالك في منظومة "My Rose Dental".
أنت تقدم استشارات دقيقة وموثوقة، تشخيصات فارقة (Differential Diagnosis)، خطط علاج سريرية وجراحية معاصرة (Implantology, Endodontics, Periodontics, Prosthodontics, Orthodontics)، وبروتوكولات دوائية ومضادات حيوية معتمدة علمياً، بأسلوب طبي احترافي وداعم باللغة العربية (مع المصطلحات الطبية الإنجليزية عند اللزوم).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "لم يتم الحصول على رد من المساعد الطبي.";
    res.json({ reply, isSimulated: false });
  } catch (error: any) {
    console.error("Dental AI Consultation Error:", error);
    res.status(500).json({
      error: error.message || "حدث خطأ أثناء معالجة الاستشارة الطبية",
    });
  }
});

// Start Express Server with Vite integration
async function start() {
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
    console.log(`My Rose Dental server running on http://0.0.0.0:${PORT}`);
  });
}

start();
