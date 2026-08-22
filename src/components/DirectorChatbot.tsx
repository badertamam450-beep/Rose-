import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Clapperboard,
  Camera,
  Zap,
  RotateCcw,
  Copy,
  Check,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { ChatMessage, ChatRoleType, StoryboardProject, StoryboardShot } from "../types";

interface DirectorChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  project: StoryboardProject | null;
  onAddShotFromChat?: (shot: Partial<StoryboardShot>) => void;
}

export const DirectorChatbot: React.FC<DirectorChatbotProps> = ({
  isOpen,
  onClose,
  project,
  onAddShotFromChat,
}) => {
  const [roleType, setRoleType] = useState<ChatRoleType>("director");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-msg",
      role: "model",
      text: "Hello! I am your AI Director & Storyboard Consultant. Whether you need deep script doctoring, cinematography lighting advice, or quick shot ideas, I'm here to collaborate. What would you like to explore for your scene?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: "gemini-3.1-pro-preview",
      roleType: "director",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      roleType,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build context from active project
      const context = {
        title: project?.title,
        logline: project?.logline,
        stylePreset: project?.stylePreset,
        scriptExcerpt: project?.rawScript?.slice(0, 1500),
        activeScene: project?.scenes?.[0]
          ? {
              heading: project.scenes[0].heading,
              shotsCount: project.scenes[0].shots.length,
            }
          : undefined,
      };

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          roleType,
          context,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to reach AI Director.");
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.modelUsed,
        roleType,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        text: `Error: ${err.message || "Could not process request."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        roleType,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: "model",
        text: `Switched to ${
          roleType === "director"
            ? "Director & Script Doctor"
            : roleType === "cinematographer"
            ? "Cinematographer & Lighting Master"
            : "Fast Assistant"
        }. How can I assist with your visual sequence?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        roleType,
      },
    ]);
  };

  const quickPrompts = [
    {
      label: "Dramatic Standoff Shot",
      prompt: "Suggest an intense over-the-shoulder reaction shot to heighten tension in this scene.",
    },
    {
      label: "Lighting & Lens Advice",
      prompt: "What lens focal length and lighting color contrast would best enhance the atmospheric mood?",
    },
    {
      label: "Pacing & Transition",
      prompt: "How can we transition smoothly from the wide establishing shot to the close-up?",
    },
    {
      label: "Audio & SFX Cues",
      prompt: "Suggest realistic ambient sound effects and audio cues for this storyboard sequence.",
    },
  ];

  if (!isOpen) return null;

  return (
    <aside
      id="director-chatbot-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-zinc-950/95 border-l border-zinc-800 shadow-2xl backdrop-blur-xl flex flex-col transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-bold shadow-md">
            <Sparkles className="w-4 h-4 fill-zinc-950" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 font-serif">AI Storyboard Director</h3>
            <p className="text-[11px] text-zinc-400">Multi-turn screenwriting & cinematography advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            id="btn-close-chatbot"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role Selection Tabs with model indicators */}
      <div className="p-2.5 bg-zinc-900/40 border-b border-zinc-800/80">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          <button
            id="role-btn-director"
            onClick={() => setRoleType("director")}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
              roleType === "director"
                ? "bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-1">
              <Clapperboard className="w-3 h-3" />
              <span className="font-semibold">Director</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">gemini-3.1-pro</span>
          </button>

          <button
            id="role-btn-cinematographer"
            onClick={() => setRoleType("cinematographer")}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
              roleType === "cinematographer"
                ? "bg-zinc-800 text-cyan-300 shadow-sm border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span className="font-semibold">DP / Camera</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">gemini-3.5-flash</span>
          </button>

          <button
            id="role-btn-fast-assistant"
            onClick={() => setRoleType("fast_assistant")}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
              roleType === "fast_assistant"
                ? "bg-zinc-800 text-emerald-300 shadow-sm border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="font-semibold">Fast Prompt</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">flash-lite</span>
          </button>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 border-b border-zinc-800/60 bg-zinc-950/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.prompt)}
            className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 text-[11px] font-medium border border-zinc-800 shrink-0 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Scrollable Conversation Thread */}
      <div
        id="chat-messages-container"
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-500">
              {msg.role === "user" ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-amber-400" />
                  <span className="font-semibold text-zinc-300">
                    {msg.roleType === "cinematographer"
                      ? "Cinematographer AI"
                      : msg.roleType === "fast_assistant"
                      ? "Prompt Assistant"
                      : "Director AI"}
                  </span>
                  {msg.modelUsed && (
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {msg.modelUsed}
                    </span>
                  )}
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed transition-all shadow-sm ${
                msg.role === "user"
                  ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-sm"
                  : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-sm"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Bot Action Buttons */}
              {msg.role === "model" && (
                <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <button
                    onClick={() => handleCopy(msg.text, index)}
                    className="hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Advice</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 w-fit">
            <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Consulting {roleType}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="chat-user-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask the ${roleType === "director" ? "Director" : roleType === "cinematographer" ? "Cinematographer" : "Assistant"}...`}
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-500"
          />
          <button
            type="submit"
            id="btn-chat-send"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold disabled:opacity-40 transition-colors shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
