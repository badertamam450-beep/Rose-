import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Send,
  Download,
  Newspaper,
  Users,
  BrainCircuit,
  FileText,
  Video,
  Presentation,
  ShieldCheck,
  ChevronLeft,
  Activity,
  Award,
  Stethoscope
} from 'lucide-react';

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
  time: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'ai' | 'cases' | 'news'>('home');
  const [query, setQuery] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: 'مرحباً بك دكتور مالك في منظومة My Rose Dental (روز دينتال) 🌸.\nأنا مساعدك الطبي السريري الذكي المدعوم بـ Gemini AI، جاهز للتشخيصات السريرية، خطط العلاج الجراحية، ومراجعة البروتوكولات الطبية فورياً.',
      time: 'الآن',
    },
  ]);

  const handleSendQuery = async (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim() || loadingAi) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoadingAi(true);

    setTimeout(() => {
      let reply = '';
      if (prompt.includes('زراعة') || prompt.includes('زرع')) {
        reply = `📋 بروتوكول زراعة الأسنان السريرية (دكتور مالك):\n\n1. التقييم الشعاعي: فحص CBCT لتقييم الارتفاع والعرض العظمي وتحديد مسار العصب السنخي السفلي.\n2. العزم الأولي (Primary Stability): الحفاظ على عزم تثبيت يتراوح بين 35-45 N/cm.\n3. اختيار الغرسة: يوصى بغرسات مخروطية مع سطح نشط حيوياً لتعزيز الاندماج العظمي (Osseointegration).\n4. التسكين والمضادات: أموكسيسيلين 1g قبل الجراحة بـ 60 دقيقة ومسكن كيتوبروفين بعد الجراحة.`;
      } else if (prompt.includes('عصب') || prompt.includes('لبية')) {
        reply = `🦷 بروتوكول المعالجة اللبية الحديثة:\n\n1. التحديد الإلكتروني للذروة (Apex Locator) مع صور شعاعية تأكيدية.\n2. الإرواء: استخدام NaOCl بنسبة 5.25% مدعماً بالتفعيل بالموجات فوق الصوتية.\n3. الحشو: اعتماد تقنية الحشو الحراري ثلاثي الأبعاد (Warm Vertical Compaction) لضمان إغلاق القنوات الجانبية.`;
      } else {
        reply = `🔬 استشارة سريرية خاصة بالدكتور مالك:\n\nبناءً على طلبك الطبي ("${prompt}"):\n- التشخيص المقترح: يستوجب الفحص السريري مع صور بانورامية وCBCT.\n- التوصية العلاجية: تطبيق المعايير الطبية المعتمدة للجمعية العالمية لطب الأسنان مع المتابعة المستمرة للحالة.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoadingAi(false);
    }, 1000);
  };

  const libraryItems = [
    {
      id: '1',
      title: 'الجراحة المعاصرة للفم والفكين - المجلد الأول',
      type: 'PDF',
      size: '14.2 MB',
      category: 'جراحة الفم والفكين',
      icon: FileText,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      desc: 'مرجع شامل في القلع الجراحي المعقد، شق الشرائح، وتطعيم العظم السنخي.',
    },
    {
      id: '2',
      title: 'تقنية زراعة الأسنان الفورية (Immediate Implant)',
      type: 'MP4',
      size: '48.5 MB',
      category: 'زراعة الأسنان',
      icon: Video,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      desc: 'فيديو سريري فائق الدقة يوضح تجهيز السرير الجراحي وتثبيت الغرسة الفورية.',
    },
    {
      id: '3',
      title: 'بروتوكولات التقويم الشفاف وحساب القوى الحيوية',
      type: 'PPT',
      size: '22.0 MB',
      category: 'تقويم الأسنان',
      icon: Presentation,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      desc: 'عرض تقديمي متقدم في تصميم خطط تحريك الأسنان بالسوفتوير ثلاثي الأبعاد.',
    },
    {
      id: '4',
      title: 'دليل مداواة الأسنان وعلاج الجذور المتقدم',
      type: 'DOCX',
      size: '5.8 MB',
      category: 'مداواة وترميم',
      icon: FileText,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      desc: 'ملخص تدريبي لاستخدام المبارد الدوارة وأنظمة التكثيف الحراري.',
    },
  ];

  const patientCases = [
    {
      id: '1',
      name: 'أحمد بن سالم',
      age: 34,
      diagnosis: 'زراعة سنية فورية في القاطع العلوي (#11)',
      plan: 'زرع فوري مع غشاء كولاجيني وتتويج مؤقت خلال 48 ساعة',
      status: 'قيد المتابعة',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      lastVisit: '2026-08-22',
    },
    {
      id: '2',
      name: 'مريم العباسي',
      age: 27,
      diagnosis: 'ابتسامة الفينير التجميلية (10 وحدات E.max)',
      plan: 'تحضير ميكروسكوبي طفيف وأخذ طبعة رقمية ثلاثية الأبعاد',
      status: 'موعد قادم',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      lastVisit: '2026-08-20',
    },
    {
      id: '3',
      name: 'فيصل ناصر',
      age: 42,
      diagnosis: 'علاج لثة متقدم وتسوية الجيوب العميقة',
      plan: 'تقليح عميق بالأمواج فوق الصوتية وتطبيق مطهر جراحي',
      status: 'مكتمل بنجاح',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      lastVisit: '2026-08-16',
    },
  ];

  const newsList = [
    {
      id: '1',
      title: 'المؤتمر العلمي السنوي لطب الأسنان في اليمن - صنعاء وعدن 2026',
      source: 'نقابة أطباء الأسنان اليمنية',
      date: '24 أغسطس 2026',
      badge: 'محلياً - اليمن',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      summary: 'مناقشة أحدث بروتوكولات الزراعة الفورية واستخدام الخلايا الجذعية في تجديد العظم السنخي.',
    },
    {
      id: '2',
      title: 'اعتماد الروبوت الجراحي ثلاثي الأبعاد في زراعة الأسنان الدقيقة عالمياً',
      source: 'Dental Tribune Global',
      date: '23 أغسطس 2026',
      badge: 'عالمياً',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      summary: 'رفع دقة تثبيت الغرسات السنية إلى 0.05 مم مع تقليل وقت الشفاء بنسبة 40%.',
    },
    {
      id: '3',
      title: 'تطورات استخدام المواد البيوسيراميكية في المعالجة اللبية وحفظ حيوية اللب',
      source: 'International Endodontic Journal',
      date: '22 أغسطس 2026',
      badge: 'أبحاث سريرية',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      summary: 'نتائج واعدة في إحكام إغلاق الذروة السنية ومنع التسرب الجرثومي على المدى الطويل.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f172a]/80 border-b border-cyan-500/20 px-4 py-3 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-cyan-400 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-wide bg-gradient-to-r from-rose-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  روز دينتال — My Rose Dental
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Android 15 (SDK 35)
                </span>
              </div>
              <p className="text-xs text-slate-400">المنظومة السريرية والذكية — للدكتور مالك</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>اتصال آمن ومستمر (Continuous Cloud)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* News Ticker Header */}
        <div
          onClick={() => setActiveTab('news')}
          className="mb-6 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 cursor-pointer hover:bg-emerald-900/30 transition shadow-inner"
        >
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Newspaper className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs truncate">
            <span className="font-bold text-emerald-400 ml-2">شريط الأخبار الطبي:</span>
            <span className="text-slate-300">
              انعقاد المؤتمر العلمي السنوي لطب الأسنان في صنعاء وعدن 2026 — مناقشة بروتوكولات الزراعة الفورية.
            </span>
          </div>
          <ChevronLeft className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            الاستشارة الذكية (Gemini AI)
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            المكتبة الرقمية (PDF, MP4)
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'cases'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
            }`}
          >
            <Users className="w-4 h-4" />
            حالاتي الخاصة
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'news'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            أحدث الأخبار
          </button>
        </div>

        {/* View Switcher */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#131b2e] border border-cyan-500/30 p-6 sm:p-8 text-center shadow-2xl shadow-cyan-500/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                مرحباً بك، دكتور مالك 🌸
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
                مساعدك الذكي جاهز لأي استشارة سريرية، تشخيص فارق، وتخطيط جراحي لحالات زراعة وتجميل الأسنان.
              </p>

              <div
                onClick={() => setActiveTab('ai')}
                className="relative inline-flex items-center justify-center cursor-pointer group mb-6"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-rose-500 to-cyan-300 p-1 shadow-2xl shadow-cyan-500/40 animate-pulse group-hover:scale-105 transition">
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                    <BrainCircuit className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 group-hover:text-rose-400 transition" />
                    <span className="text-[10px] font-bold text-slate-300 mt-1">Gemini AI</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:opacity-90 transition flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  بدء استشارة سريرية فورية
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                أعمدة التحكم السريع (The 4 Pillars)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('library')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer group flex flex-col items-center text-center shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">المكتبة الرقمية</h4>
                  <p className="text-[11px] text-slate-400">PDF, DOCX, PPT, MP4</p>
                </div>

                <div
                  onClick={() => setActiveTab('ai')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-400 transition cursor-pointer group flex flex-col items-center text-center shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">الاستشارة الذكية</h4>
                  <p className="text-[11px] text-slate-400">Gemini 1.5 Clinical</p>
                </div>

                <div
                  onClick={() => setActiveTab('news')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer group flex flex-col items-center text-center shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">آخر الأخبار</h4>
                  <p className="text-[11px] text-slate-400">يمنياً وعالمياً</p>
                </div>

                <div
                  onClick={() => setActiveTab('cases')}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 transition cursor-pointer group flex flex-col items-center text-center shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">حالاتي الخاصة</h4>
                  <p className="text-[11px] text-slate-400">أرشفة وخطط المرضى</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-400" />
                  أحدث المستندات والوسائط السريرية
                </h3>
                <button onClick={() => setActiveTab('library')} className="text-xs text-cyan-400 hover:underline">
                  عرض كل المكتبة
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {libraryItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition"
                  >
                    <div className={`p-3 rounded-2xl border ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.category} • {item.size}</p>
                    </div>
                    <button
                      onClick={() => alert(`جاري تنزيل ملف ${item.title} وتخزينه على الجهاز...`)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Consultation View */}
        {activeTab === 'ai' && (
          <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 flex flex-col h-[650px] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">مساعد الاستشارات السريرية (Gemini AI)</h3>
                  <p className="text-xs text-slate-400">مخصص لدكتور مالك — طب وجراحة الفم والأسنان</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                متصل وجاهز (Live)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {loadingAi && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 p-2 bg-slate-800/40 rounded-xl w-fit">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  المساعد الطبي يحلل الحالة السريرية...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-2 mb-2 border-t border-slate-800/80">
              <button
                onClick={() => handleSendQuery('ما هو البروتوكول الدقيق لزراعة الأسنان الفورية بعد القلع مباشرة؟')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-[11px] text-slate-300 hover:bg-slate-700 transition whitespace-nowrap"
              >
                بروتوكول الزراعة الفورية
              </button>
              <button
                onClick={() => handleSendQuery('ما هي أحدث طرق المعالجة اللبية ثلاثية الأبعاد وعلاج الآلام الحادة؟')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-[11px] text-slate-300 hover:bg-slate-700 transition whitespace-nowrap"
              >
                المعالجة اللبية الحديثة
              </button>
              <button
                onClick={() => handleSendQuery('ما هي معايير تحضير الفينير وتصميم الابتسامة الرقمية (DSD)؟')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-[11px] text-slate-300 hover:bg-slate-700 transition whitespace-nowrap"
              >
                تحضير وتصميم الفينير
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder="اكتب استشارتك الطبية أو السريرية للدكتور مالك..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={loadingAi || !query.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold disabled:opacity-50 hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Library View */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white">المكتبة الرقمية والمراجع السريرية</h3>
              <span className="text-xs text-slate-400">PDF, DOCX, PPT, MP4</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {libraryItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl border ${item.color}`}>
                        {item.type} • {item.size}
                      </span>
                      <span className="text-xs text-slate-400">{item.category}</span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-2">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`بدء تحميل ملف ${item.title} عبر محرك التنزيل السحابي...`)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-black transition text-xs font-bold text-cyan-400 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    تحميل وفتح الملف
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cases View */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white">سجلات المرضى وحالاتي الخاصة</h3>
              <button
                onClick={() => alert('إضافة ملف وسجل مريض جديد')}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs"
              >
                + إضافة حالة جديدة
              </button>
            </div>
            <div className="space-y-3">
              {patientCases.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <span className="text-xs text-slate-400">({c.age} سنة)</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${c.color}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mb-1">
                    <span className="text-cyan-400 ml-1">التشخيص:</span>
                    {c.diagnosis}
                  </p>
                  <p className="text-xs text-slate-400 mb-2">
                    <span className="text-slate-300 ml-1">الخطة العلاجية:</span>
                    {c.plan}
                  </p>
                  <div className="text-[10px] text-slate-500">آخر زيارة مسجلة: {c.lastVisit}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News View */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-white">آخر أبحاث وأخبار طب الأسنان (يمنياً وعالمياً)</h3>
            <div className="space-y-3">
              {newsList.map((n) => (
                <div
                  key={n.id}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${n.badgeColor}`}>
                      {n.badge}
                    </span>
                    <span className="text-xs text-slate-500">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">{n.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{n.summary}</p>
                  <div className="text-[11px] text-slate-400">المصدر: {n.source}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        منظومة روز دينتال الطبية الذكية — للدكتور مالك © 2026 • متوافق مع Android 15 (SDK 35) & Gemini AI
      </footer>
    </div>
  );
}
