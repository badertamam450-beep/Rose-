import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Mic,
  Newspaper,
  FolderLock,
  FileText,
  PlayCircle,
  Home,
  Settings,
  BrainCircuit,
  Send,
  X,
  Plus,
  Search,
  Bell,
  Stethoscope,
  ChevronRight,
  Download,
  CheckCircle2,
  Calendar,
  Volume2,
} from "lucide-react";
import { DentalCase, DentalDocument, DentalNewsItem, ChatMessage } from "./types";

const INITIAL_DOCUMENTS: DentalDocument[] = [
  {
    id: "doc-1",
    title: "الجراحة المعاصرة - المجلد الأول",
    category: "PDF",
    accentColor: "#E11D48",
    description: "مرجع شامل في جراحة الفم والفكين والقلع الجراحي المعقد.",
    size: "14.2 MB",
    dateAdded: "اليوم",
  },
  {
    id: "doc-2",
    title: "تقنية زراعة الأسنان الفورية",
    category: "MP4",
    accentColor: "#D97706",
    description: "فيديو جراحي تفصيلي لبروتوكول Immediate Implant Placement.",
    size: "48.5 MB",
    dateAdded: "أمس",
  },
  {
    id: "doc-3",
    title: "أحدث بروتوكولات حشو العصب ثلاثي الأبعاد",
    category: "PDF",
    accentColor: "#0284C7",
    description: "دليل Endodontics الحديث لاستخدام الروتاري والمطاط الحراري.",
    size: "8.9 MB",
    dateAdded: "منذ يومين",
  },
];

const INITIAL_CASES: DentalCase[] = [
  {
    id: "c-101",
    patientName: "أحمد بن سالم",
    patientAge: 34,
    condition: "زراعة سنية فورية في القاطع العلوي الأيمن (#11)",
    treatmentPlan: "زرع فوري مع طعم عظمي وتتويج مؤقت خلال 48 ساعة",
    status: "active",
    lastVisit: "2026-08-20",
    notes: "نسبة كثافة العظم جيدة D2، تم استخدام زرعة بقطر 4.2mm وطول 11.5mm.",
  },
  {
    id: "c-102",
    patientName: "مريم العباسي",
    patientAge: 27,
    condition: "تجميل ابتسامة الفينير (10 وحدات علوية)",
    treatmentPlan: "تحضير بسيط ميكروسكوبي وتثبيت E.max veneers",
    status: "scheduled",
    lastVisit: "2026-08-18",
    notes: "تم اختيار اللون BL2 مع تدريج شفافية طردية في الحواف القاطعة.",
  },
  {
    id: "c-103",
    patientName: "فيصل ناصر",
    patientAge: 42,
    condition: "علاج لثة متقدم وجراحة تسوية العظم",
    treatmentPlan: "تقليح عميق بالأمواج فوق الصوتية وتطبيق موضع المضاد الحيوي",
    status: "completed",
    lastVisit: "2026-08-15",
    notes: "انخفاض عمق الجيوب اللثوية من 6mm إلى 2.5mm مع التئام تام.",
  },
];

const INITIAL_NEWS: DentalNewsItem[] = [
  {
    id: "news-1",
    title: "اعتماد روبوتات الذكاء الاصطناعي في توجيه جراحات زراعة الأسنان الرقمية",
    source: "المجلة الدولية لطب الأسنان الحديث",
    date: "22 أغسطس 2026",
    summary: "تقنية ملاحة جراحية ثلاثية الأبعاد بدقة تصل إلى 0.05 ملم ترفع نسبة نجاح الزراعة الفورية.",
    category: "تقنيات",
  },
  {
    id: "news-2",
    title: "المؤتمر العلمي السنوي لطب الفم والأسنان في صنعاء وعدن",
    source: "نقابة أطباء الأسنان",
    date: "20 أغسطس 2026",
    summary: "تسليط الضوء على تقنيات الطباعة ثلاثية الأبعاد وطب الأسنان التجديدي والخلايا الجذعية.",
    category: "مؤتمرات",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "library" | "ai" | "cases" | "settings">("home");
  const [activeModal, setActiveModal] = useState<"ai" | "library" | "cases" | "news" | null>(null);

  // Chat / Consultation State
  const [promptInput, setPromptInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: "مرحباً بك دكتور مالك في منظومة My Rose Dental! 🌸\nمساعدك الذكي جاهز لأي استشارة سريرية، تشخيص فارق، أو استفسار جراحي.",
      timestamp: "الآن",
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Cases and Docs State
  const [casesList, setCasesList] = useState<DentalCase[]>(INITIAL_CASES);
  const [docsList, setDocsList] = useState<DentalDocument[]>(INITIAL_DOCUMENTS);
  const [newsList] = useState<DentalNewsItem[]>(INITIAL_NEWS);

  // Filter / Search
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendPrompt = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptInput.trim();
    if (!textToSend || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "doctor",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPromptInput("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/gemini/dental-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: data.reply || "تمت معالجة الاستشارة بنجاح.",
        timestamp: new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }),
        isSimulated: data.isSimulated,
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: `حدث خطأ في الاتصال بالخدمة الطبية: ${err.message || "يرجى المحاولة مجدداً"}`,
        timestamp: new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] flex flex-col font-sans selection:bg-[#00E5FF]/20 selection:text-[#0F172A]" dir="rtl">
      {/* 1. Header (The Neural Crown) */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#00E5FF]/20 shadow-xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 3D Crystal Rose & Neural Core Icon */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF4081] via-[#FF80AB] to-[#00E5FF] p-[2px] shadow-md shadow-[#FF4081]/25 group cursor-pointer transition-transform active:scale-95">
              <div className="w-full h-full bg-[#0F172A] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4081]/30 to-[#00E5FF]/30 animate-pulse" />
                <Sparkles className="w-5 h-5 text-[#00E5FF] relative z-10" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-[#0F172A] flex items-center gap-1.5">
                My Rose Dental
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00838F] font-bold border border-[#00E5FF]/30">
                  Android 15
                </span>
              </h1>
              <p className="text-[11px] text-gray-500 font-semibold">روز دينتال - المنظومة الطبية الذكية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal("ai")}
              className="relative p-2 rounded-xl bg-gray-100 hover:bg-[#00E5FF]/10 text-[#0F172A] transition-colors"
              title="الإشعارات والاستشارات"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4081] ring-2 ring-white animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4081] ring-2 ring-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 pb-28 space-y-5">
        {/* 2. Welcome & AI Hologram Section (The Hub) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-gray-50/80 p-5 border border-[#00E5FF]/30 shadow-lg shadow-[#FF4081]/5 text-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#00E5FF]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#FF4081]/15 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
            مرحباً بك، دكتور مالك
          </h2>
          <p className="text-xs text-[#64748B] font-semibold mt-1">
            مساعدك الذكي جاهز لأي استشارة طبيّة وسريرية
          </p>

          {/* 3D Holographic AI Neural Head Representation */}
          <div className="my-4 flex justify-center">
            <div
              onClick={() => setActiveModal("ai")}
              className="relative cursor-pointer group transition-transform active:scale-95"
            >
              {/* Outer Orbital Rotating Glow Ring */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00E5FF] via-[#FF4081] to-[#00E5FF] p-[3px] shadow-lg shadow-[#00E5FF]/30 animate-spin-slow">
                <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center">
                  <BrainCircuit className="w-12 h-12 text-[#00E5FF] group-hover:text-[#FF4081] transition-colors" />
                </div>
              </div>

              {/* Pulsing Active Indicator Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#0F172A] border border-[#00E5FF] rounded-full text-[10px] text-[#00E5FF] font-black tracking-wider flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                Gemini AI
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModal("ai")}
            className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span>بدء استشارة سريرية فورية مع الذكاء الاصطناعي</span>
          </button>
        </section>

        {/* 3. The 4 Architectural Pillars (Dashboard) */}
        <section>
          <div className="grid grid-cols-4 gap-2.5">
            {/* Pillar 1: Digital Library */}
            <button
              onClick={() => setActiveModal("library")}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#00E5FF]/40 shadow-xs hover:border-[#00E5FF] hover:shadow-md transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 flex items-center justify-center text-[#00B0FF] group-hover:bg-[#00E5FF] group-hover:text-white transition-colors mb-1.5 shadow-inner">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-[#0F172A] leading-tight">المكتبة</span>
              <span className="text-[10px] font-bold text-gray-500">الرقمية</span>
            </button>

            {/* Pillar 2: AI Consultation */}
            <button
              onClick={() => setActiveModal("ai")}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#FF4081]/40 shadow-xs hover:border-[#FF4081] hover:shadow-md transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF4081]/15 flex items-center justify-center text-[#FF4081] group-hover:bg-[#FF4081] group-hover:text-white transition-colors mb-1.5 shadow-inner">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-[#0F172A] leading-tight">الاستشارة</span>
              <span className="text-[10px] font-bold text-gray-500">الذكية</span>
            </button>

            {/* Pillar 3: Latest News */}
            <button
              onClick={() => setActiveModal("news")}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#00C853]/40 shadow-xs hover:border-[#00C853] hover:shadow-md transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00C853]/15 flex items-center justify-center text-[#00C853] group-hover:bg-[#00C853] group-hover:text-white transition-colors mb-1.5 shadow-inner">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-[#0F172A] leading-tight">آخر</span>
              <span className="text-[10px] font-bold text-gray-500">الأخبار</span>
            </button>

            {/* Pillar 4: Private Cases */}
            <button
              onClick={() => setActiveModal("cases")}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#D97706]/40 shadow-xs hover:border-[#D97706] hover:shadow-md transition-all active:scale-95 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 flex items-center justify-center text-[#D97706] group-hover:bg-[#D97706] group-hover:text-white transition-colors mb-1.5 shadow-inner">
                <FolderLock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-[#0F172A] leading-tight">حالاتي</span>
              <span className="text-[10px] font-bold text-gray-500">الخاصة</span>
            </button>
          </div>
        </section>

        {/* 4. Updated Media & Documents Section (The Flow) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#FF4081]" />
              أحدث المستندات والفيديوهات
            </h3>
            <button
              onClick={() => setActiveModal("library")}
              className="text-[11px] font-bold text-[#00838F] hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
            {docsList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveModal("library")}
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-3.5 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-[#00E5FF]/50 transition-all cursor-pointer flex items-center gap-3 active:scale-[0.98]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm"
                  style={{ backgroundColor: doc.accentColor }}
                >
                  {doc.category === "PDF" ? (
                    <FileText className="w-6 h-6" />
                  ) : (
                    <PlayCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-black text-[#0F172A] truncate" title={doc.title}>
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white uppercase"
                      style={{ backgroundColor: doc.accentColor }}
                    >
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{doc.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Quick Medical Shortcuts for Dr. Malek */}
        <section className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
            استشارات سريرية سريعة بنقرة واحدة
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "بروتوكول زراعة الأسنان الفورية بعد القلع",
              "علاج آلام العصب الحادة والتسكين الموضعي",
              "اختيار لون ومادة الفينير المناسبة",
              "جرعات المضادات الحيوية لمرضى الحساسية",
            ].map((quickQuery, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveModal("ai");
                  handleSendPrompt(quickQuery);
                }}
                className="text-xs font-bold text-gray-700 bg-gray-50 hover:bg-[#00E5FF]/10 hover:text-[#00838F] border border-gray-200/80 rounded-xl px-3 py-1.5 transition-all text-right"
              >
                + {quickQuery}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 6. Curved Bottom Navigation Foundation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 rounded-t-3xl shadow-xl shadow-black/10">
        <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              activeTab === "home" ? "text-[#00B0FF] font-black" : "text-gray-400 font-semibold"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">الرئيسية</span>
          </button>

          {/* Library Tab */}
          <button
            onClick={() => setActiveModal("library")}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              activeTab === "library" ? "text-[#00B0FF] font-black" : "text-gray-400 font-semibold"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">المكتبة</span>
          </button>

          {/* Center Elevated Gemini AI Button */}
          <button
            onClick={() => setActiveModal("ai")}
            className="relative -top-4 flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF4081] via-[#FF80AB] to-[#00E5FF] p-[3px] shadow-lg shadow-[#FF4081]/30">
              <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center text-white">
                <Sparkles className="w-7 h-7 text-[#00E5FF] animate-pulse" />
              </div>
            </div>
            <span className="text-[10px] font-black text-[#FF4081] mt-0.5">Gemini AI</span>
          </button>

          {/* Cases Tab */}
          <button
            onClick={() => setActiveModal("cases")}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              activeTab === "cases" ? "text-[#00B0FF] font-black" : "text-gray-400 font-semibold"
            }`}
          >
            <FolderLock className="w-5 h-5" />
            <span className="text-[10px]">الحالات</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveModal("news")}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              activeTab === "settings" ? "text-[#00B0FF] font-black" : "text-gray-400 font-semibold"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">الإعدادات</span>
          </button>
        </div>
      </nav>

      {/* MODAL 1: AI Clinical Consultation Dialog */}
      {activeModal === "ai" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF4081] to-[#00E5FF] p-0.5">
                  <div className="w-full h-full bg-[#0F172A] rounded-xl flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-1.5">
                    الاستشارة الطبية الذكية
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold">
                      Gemini 2.5
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-semibold">المساعد السريري المخصص لدكتور مالك</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "doctor" ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-semibold shadow-xs ${
                      msg.sender === "doctor"
                        ? "bg-[#0F172A] text-white rounded-tr-xs"
                        : "bg-white border border-gray-200 text-[#0F172A] rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        msg.sender === "doctor" ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF4081] bg-white p-3 rounded-2xl border border-gray-200 w-fit">
                  <Sparkles className="w-4 h-4 animate-spin text-[#00E5FF]" />
                  <span>المساعد الطبي يحلل الاستشارة السريرية...</span>
                </div>
              )}
            </div>

            {/* Input Field */}
            <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
                placeholder="اكتب استشارتك الطبية حول تشخيص أو خطة علاج..."
                className="flex-1 px-4 py-2.5 text-xs bg-gray-100 rounded-2xl border border-gray-200 focus:outline-hidden focus:border-[#00E5FF] focus:bg-white font-semibold"
              />
              <button
                onClick={() => handleSendPrompt()}
                disabled={!promptInput.trim() || isAiLoading}
                className="p-2.5 rounded-2xl bg-[#0F172A] text-[#00E5FF] disabled:opacity-50 hover:bg-[#1E293B] transition-all"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Digital Library Dialog */}
      {activeModal === "library" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00E5FF]" />
                المكتبة الرقمية الطبية
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {docsList.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs"
                      style={{ backgroundColor: doc.accentColor }}
                    >
                      {doc.category}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#0F172A]">{doc.title}</h4>
                      <p className="text-[11px] text-gray-500 font-semibold mt-0.5">{doc.description}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-[#00E5FF]/10 hover:text-[#00838F]">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cases Management Dialog */}
      {activeModal === "cases" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-[#D97706]" />
                سجلات وحالات المرضى الخاصة
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {casesList.map((c) => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#0F172A]">
                      {c.patientName} ({c.patientAge} سنة)
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        c.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : c.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {c.status === "completed" ? "مكتمل" : c.status === "active" ? "قيد العلاج" : "موعد قادم"}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700">التشخيص: {c.condition}</p>
                  <p className="text-[10px] text-gray-500">الخطة: {c.treatmentPlan}</p>
                  <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-200/60 mt-1">
                    آخر زيارة: {c.lastVisit} | ملاحظات: {c.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Latest Dental News Dialog */}
      {activeModal === "news" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#00C853]" />
                أحدث أخبار وأبحاث طب الأسنان
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {newsList.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded-md">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{n.date}</span>
                  </div>
                  <h4 className="text-xs font-black text-[#0F172A] leading-snug">{n.title}</h4>
                  <p className="text-[11px] text-gray-600 font-semibold">{n.summary}</p>
                  <p className="text-[10px] text-gray-400">المصدر: {n.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
