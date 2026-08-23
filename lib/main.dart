import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'services/dental_ai_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyRoseDentalApp());
}

class MyRoseDentalApp extends StatelessWidget {
  const MyRoseDentalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Rose Dental',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF5F7FA),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00E5FF),
          primary: const Color(0xFF00E5FF),
          secondary: const Color(0xFFFF4081),
        ),
      ),
      locale: const Locale('ar', 'YE'),
      supportedLocales: const [
        Locale('ar', 'YE'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  final DentalAiService _aiService = DentalAiService();
  bool _isLoadingAi = false;

  static const Color electricCyan = Color(0xFF00E5FF);
  static const Color vibrantRose = Color(0xFFFF4081);
  static const Color emeraldGreen = Color(0xFF00C853);
  static const Color metallicGold = Color(0xFFFFD700);
  static const Color darkSlate = Color(0xFF0F172A);

  // Chat message history
  final List<Map<String, String>> _chatMessages = [
    {
      'role': 'ai',
      'text': 'مرحباً دكتور مالك في منظومة My Rose Dental! 🌸\nمساعدك الذكي جاهز لأي استشارة سريرية، تشخيص فارق، أو خطة علاج جراحية.',
      'time': 'الآن',
    },
  ];

  // News Items
  final List<Map<String, String>> _newsItems = [
    {
      'title': 'المؤتمر العلمي السنوي لطب الأسنان في اليمن - صنعاء وعدن 2026',
      'source': 'نقابة أطباء الأسنان اليمنية',
      'date': '23 أغسطس 2026',
      'category': 'يمنياً',
      'summary': 'مناقشة أحدث بروتوكولات الزراعة الفورية واستخدام الخلايا الجذعية في تجديد العظم السنخي.',
    },
    {
      'title': 'اعتماد تقنية الروبوت الجراحي ثلاثي الأبعاد في زراعة الأسنان الرقمية',
      'source': 'Dental Tribune Global',
      'date': '22 أغسطس 2026',
      'category': 'عالمياً',
      'summary': 'رفع دقة تثبيت الغرسات السنية إلى 0.05 مم مع تقليل وقت الشفاء بنسبة 40%.',
    },
    {
      'title': 'تحديثات المعالجة اللبية ثلاثية الأبعاد باستخدام المواد الحيوية التجديدية (Bioceramics)',
      'source': 'International Endodontic Journal',
      'date': '20 أغسطس 2026',
      'category': 'أبحاث',
      'summary': 'نتائج واعدة في إحكام إغلاق الذروة السنية ومنع التسرب الجرثومي على المدى الطويل.',
    },
  ];

  // Library Documents categorized
  final List<Map<String, dynamic>> _libraryDocs = [
    {
      'title': 'الجراحة المعاصرة للفم والفكين - المجلد الأول',
      'type': 'PDF',
      'size': '14.2 MB',
      'category': 'جراحة',
      'color': const Color(0xFFE11D48),
      'desc': 'مرجع شامل في القلع الجراحي المعقد وزراعة العظم.',
    },
    {
      'title': 'تقنية زراعة الأسنان الفورية (Immediate Implant)',
      'type': 'MP4',
      'size': '48.5 MB',
      'category': 'جراحة',
      'color': metallicGold,
      'desc': 'فيديو جراحي تفصيلي عالي الدقة يوضح خطوات التثبيت والعزم.',
    },
    {
      'title': 'أحدث بروتوكولات التقويم الشفاف (Clear Aligners)',
      'type': 'PPT',
      'size': '22.0 MB',
      'category': 'تقويم',
      'color': const Color(0xFF8B5CF6),
      'desc': 'عرض تقديمي شامل لحساب القوى الحيوية وتحريك الأسنان الرقمي.',
    },
    {
      'title': 'دليل مداواة الأسنان وحشو العصب الحديث',
      'type': 'DOCX',
      'size': '5.8 MB',
      'category': 'مداواة أسنان',
      'color': electricCyan,
      'desc': 'ملخص تدريبي لاستخدام المبارد الآلية ونظام الحشو الحراري.',
    },
    {
      'title': 'تصميم الابتسامة الرقمية وتركيبات الفينير E.max',
      'type': 'PDF',
      'size': '18.4 MB',
      'category': 'تركيبات',
      'color': emeraldGreen,
      'desc': 'دليل عملي لاختيار الألوان وتحضير التيجان والجسور بدقة متناهية.',
    },
  ];

  // Private Patient Cases
  final List<Map<String, dynamic>> _patientCases = [
    {
      'name': 'أحمد بن سالم',
      'age': 34,
      'diagnosis': 'زراعة سنية فورية في القاطع العلوي الأيمن (#11)',
      'plan': 'زرع فوري مع طعم عظمي وتتويج مؤقت خلال 48 ساعة',
      'status': 'قيد العلاج',
      'statusColor': Colors.blue,
      'lastVisit': '2026-08-20',
      'notes': 'كثافة العظم D2 ممتازة، تم استخدام زرعة 4.2mm × 11.5mm.',
    },
    {
      'name': 'مريم العباسي',
      'age': 27,
      'diagnosis': 'تجميل ابتسامة الفينير (10 وحدات علوية)',
      'plan': 'تحضير ميكروسكوبي طفيف وتثبيت E.max veneers',
      'status': 'موعد قادم',
      'statusColor': Colors.orange,
      'lastVisit': '2026-08-18',
      'notes': 'تم اعتماد اللون BL2 مع تدرج شفافية طردية في الحواف القاطعة.',
    },
    {
      'name': 'فيصل ناصر',
      'age': 42,
      'diagnosis': 'علاج لثة متقدم وتسوية الجيوب اللثوية',
      'plan': 'تقليح عميق بالأمواج فوق الصوتية وتطبيق مضاد حيوي موضعي',
      'status': 'مكتمل',
      'statusColor': Colors.green,
      'lastVisit': '2026-08-15',
      'notes': 'انخفاض عمق الجيوب من 6mm إلى 2.5mm مع التئام تام.',
    },
  ];

  void _openAIConsultationDialog({String? initialPrompt}) {
    final TextEditingController queryController = TextEditingController(text: initialPrompt ?? '');
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          height: MediaQuery.of(context).size.height * 0.85,
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            top: 16,
            left: 16,
            right: 16,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [vibrantRose, electricCyan],
                          ),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.auto_awesome, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 10),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'الاستشارة الطبية الذكية (Gemini AI)',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: darkSlate),
                          ),
                          Text(
                            'المساعد الطبي السريري للدكتور مالك',
                            style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Chat List
              Expanded(
                child: ListView.builder(
                  itemCount: _chatMessages.length,
                  itemBuilder: (context, index) {
                    final msg = _chatMessages[index];
                    final isUser = msg['role'] == 'user';
                    return Align(
                      alignment: isUser ? Alignment.centerLeft : Alignment.centerRight,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        padding: const EdgeInsets.all(14),
                        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                        decoration: BoxDecoration(
                          color: isUser ? darkSlate : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(18).copyWith(
                            bottomLeft: isUser ? const Radius.circular(0) : const Radius.circular(18),
                            bottomRight: !isUser ? const Radius.circular(0) : const Radius.circular(18),
                          ),
                          border: isUser ? null : Border.all(color: Colors.grey.shade200),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              msg['text'] ?? '',
                              style: TextStyle(
                                fontSize: 13,
                                color: isUser ? Colors.white : darkSlate,
                                height: 1.4,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              msg['time'] ?? '',
                              style: TextStyle(
                                fontSize: 9,
                                color: isUser ? Colors.grey.shade400 : Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              if (_isLoadingAi)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: vibrantRose)),
                      SizedBox(width: 10),
                      Text('المساعد الطبي يحلل الحالة السريرية...', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: vibrantRose)),
                    ],
                  ),
                ),
              // Quick suggestions
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildPromptChip('بروتوكول الزراعة الفورية', queryController, setModalState),
                    _buildPromptChip('علاج آلام العصب الحادة', queryController, setModalState),
                    _buildPromptChip('مضادات حيوية لمرضى الحساسية', queryController, setModalState),
                    _buildPromptChip('معايير تجميل الفينير', queryController, setModalState),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: queryController,
                      decoration: InputDecoration(
                        hintText: 'اكتب استشارتك الطبية أو الجراحية...',
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18),
                          borderSide: const BorderSide(color: electricCyan, width: 2),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: () async {
                      final text = queryController.text.trim();
                      if (text.isEmpty || _isLoadingAi) return;
                      queryController.clear();
                      setModalState(() {
                        _chatMessages.add({'role': 'user', 'text': text, 'time': 'الآن'});
                        _isLoadingAi = true;
                      });
                      setState(() {});
                      final reply = await _aiService.askDentalQuestion(text);
                      setModalState(() {
                        _isLoadingAi = false;
                        _chatMessages.add({'role': 'ai', 'text': reply ?? 'تمت المعالجة.', 'time': 'الآن'});
                      });
                      setState(() {});
                    },
                    style: IconButton.styleFrom(
                      backgroundColor: darkSlate,
                      padding: const EdgeInsets.all(12),
                    ),
                    icon: const Icon(Icons.send_rounded, color: electricCyan),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPromptChip(String text, TextEditingController controller, StateSetter setModalState) {
    return Padding(
      padding: const EdgeInsets.only(left: 6, bottom: 6),
      child: ActionChip(
        label: Text(text, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFFF1F5F9),
        side: BorderSide(color: Colors.grey.shade300),
        onPressed: () {
          controller.text = text;
          setModalState(() {});
        },
      ),
    );
  }

  void _openLibrarySheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            const Row(
              children: [
                Icon(Icons.menu_book_rounded, color: electricCyan, size: 26),
                SizedBox(width: 10),
                Text(
                  'المكتبة الرقمية الطبية (PDF, MP4, DOCX, PPT)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: darkSlate),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Expanded(
              child: ListView.separated(
                itemCount: _libraryDocs.length,
                separatorBuilder: (ctx, i) => const SizedBox(height: 10),
                itemBuilder: (ctx, i) {
                  final doc = _libraryDocs[i];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 46,
                          height: 46,
                          decoration: BoxDecoration(
                            color: (doc['color'] as Color).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Center(
                            child: Text(
                              doc['type'] as String,
                              style: TextStyle(fontWeight: FontWeight.w900, color: doc['color'] as Color, fontSize: 11),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                doc['title'] as String,
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: darkSlate),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                doc['desc'] as String,
                                style: const TextStyle(fontSize: 11, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.download_for_offline_rounded, color: darkSlate),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('جاري تنزيل ملف ${doc['title']} وتخزينه عبر Dio...')),
                            );
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openCasesSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            const Row(
              children: [
                Icon(Icons.folder_shared_rounded, color: metallicGold, size: 26),
                SizedBox(width: 10),
                Text(
                  'سجلات وحالات المرضى الخاصة',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: darkSlate),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Expanded(
              child: ListView.separated(
                itemCount: _patientCases.length,
                separatorBuilder: (ctx, i) => const SizedBox(height: 12),
                itemBuilder: (ctx, i) {
                  final item = _patientCases[i];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${item['name']} (${item['age']} سنة)',
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: darkSlate),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: (item['statusColor'] as Color).withOpacity(0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                item['status'] as String,
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: item['statusColor'] as Color),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text('التشخيص: ${item['diagnosis']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.black87)),
                        const SizedBox(height: 2),
                        Text('الخطة العلاجية: ${item['plan']}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                        const SizedBox(height: 6),
                        Text('ملاحظات: ${item['notes']}', style: const TextStyle(fontSize: 10, color: Colors.blueGrey)),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openNewsSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            const Row(
              children: [
                Icon(Icons.feed_rounded, color: emeraldGreen, size: 26),
                SizedBox(width: 10),
                Text(
                  'أحدث أخبار وأبحاث طب الأسنان (يمنياً وعالمياً)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: darkSlate),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Expanded(
              child: ListView.separated(
                itemCount: _newsItems.length,
                separatorBuilder: (ctx, i) => const SizedBox(height: 12),
                itemBuilder: (ctx, i) {
                  final news = _newsItems[i];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: emeraldGreen.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                news['category']!,
                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: emeraldGreen),
                              ),
                            ),
                            Text(news['date']!, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(news['title']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: darkSlate)),
                        const SizedBox(height: 4),
                        Text(news['summary']!, style: const TextStyle(fontSize: 11, color: Colors.black54)),
                        const SizedBox(height: 4),
                        Text('المصدر: ${news['source']}', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(),
              const SizedBox(height: 12),
              _buildNewsTicker(),
              const SizedBox(height: 12),
              _buildWelcomeCard(),
              const SizedBox(height: 18),
              _buildPillarsGrid(),
              const SizedBox(height: 22),
              _buildMediaSection(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: electricCyan.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'روز دينتال - My Rose Dental',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: darkSlate),
              ),
              Text(
                'المنظومة الطبية الذكية لدكتور مالك (Android 15)',
                style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const RadialGradient(
                colors: [vibrantRose, electricCyan],
              ),
              boxShadow: [
                BoxShadow(
                  color: vibrantRose.withOpacity(0.4),
                  blurRadius: 10,
                  spreadRadius: 1,
                )
              ],
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 24),
          ),
        ],
      ),
    );
  }

  Widget _buildNewsTicker() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: emeraldGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: emeraldGreen.withOpacity(0.3)),
      ),
      child: InkWell(
        onTap: _openNewsSheet,
        child: Row(
          children: [
            const Icon(Icons.campaign_rounded, color: emeraldGreen, size: 20),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                'شريط الأخبار: انعقاد المؤتمر العلمي لطب الأسنان في صنعاء وعدن 2026',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF166534)),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: emeraldGreen, size: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: vibrantRose.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'مرحباً بك، دكتور مالك',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: darkSlate),
          ),
          const SizedBox(height: 4),
          const Text(
            'مساعدك الذكي جاهز لأي استشارة طبية وسريرية',
            style: TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 18),
          GestureDetector(
            onTap: () => _openAIConsultationDialog(),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const SweepGradient(
                      colors: [electricCyan, vibrantRose, electricCyan],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: electricCyan.withOpacity(0.35),
                        blurRadius: 18,
                        spreadRadius: 2,
                      )
                    ],
                  ),
                ),
                Container(
                  width: 84,
                  height: 84,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: darkSlate,
                  ),
                  child: const Icon(
                    Icons.psychology_rounded,
                    color: electricCyan,
                    size: 46,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () => _openAIConsultationDialog(),
            icon: const Icon(Icons.auto_awesome, size: 16, color: electricCyan),
            label: const Text('بدء استشارة سريرية مع Gemini AI', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: darkSlate,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPillarsGrid() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildPillarButton(
          title: 'المكتبة\nالرقمية',
          icon: Icons.menu_book_rounded,
          color: electricCyan,
          onTap: _openLibrarySheet,
        ),
        _buildPillarButton(
          title: 'الاستشارة\nالذكية',
          icon: Icons.mic_rounded,
          color: vibrantRose,
          onTap: () => _openAIConsultationDialog(),
        ),
        _buildPillarButton(
          title: 'آخر\nالأخبار',
          icon: Icons.feed_rounded,
          color: emeraldGreen,
          onTap: _openNewsSheet,
        ),
        _buildPillarButton(
          title: 'حالاتي\nالخاصة',
          icon: Icons.folder_shared_rounded,
          color: metallicGold,
          onTap: _openCasesSheet,
        ),
      ],
    );
  }

  Widget _buildPillarButton({
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 78,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.4), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: color,
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.3),
                    blurRadius: 8,
                  )
                ],
              ),
              child: Icon(icon, color: Colors.white, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: darkSlate, height: 1.2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'أحدث المستندات والفيديوهات',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: darkSlate),
            ),
            TextButton(
              onPressed: _openLibrarySheet,
              child: const Text('عرض الكل', style: TextStyle(fontSize: 12, color: electricCyan, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildMediaCard(
                title: 'الجراحة المعاصرة - المجلد الأول',
                tag: 'PDF',
                accentColor: const Color(0xFFE11D48),
                icon: Icons.picture_as_pdf_rounded,
                onTap: _openLibrarySheet,
              ),
              const SizedBox(width: 14),
              _buildMediaCard(
                title: 'تقنية زراعة الأسنان الفورية',
                tag: 'MP4',
                accentColor: metallicGold,
                icon: Icons.play_circle_fill_rounded,
                onTap: _openLibrarySheet,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMediaCard({
    required String title,
    required String tag,
    required Color accentColor,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 220,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: accentColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: accentColor, size: 26),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: darkSlate, height: 1.2),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    tag,
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: accentColor),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 20,
            offset: const Offset(0, -4),
          )
        ],
      ),
      child: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) {
          if (idx == 1) {
            _openLibrarySheet();
          } else if (idx == 2) {
            _openAIConsultationDialog();
          } else if (idx == 3) {
            _openCasesSheet();
          } else if (idx == 4) {
            _openNewsSheet();
          } else {
            setState(() => _currentIndex = idx);
          }
        },
        backgroundColor: Colors.transparent,
        elevation: 0,
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_rounded),
            selectedIcon: Icon(Icons.home_rounded, color: electricCyan),
            label: 'الرئيسية',
          ),
          const NavigationDestination(
            icon: Icon(Icons.local_library_rounded),
            selectedIcon: Icon(Icons.local_library_rounded, color: electricCyan),
            label: 'المكتبة',
          ),
          NavigationDestination(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(colors: [vibrantRose, electricCyan]),
              ),
              child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
            ),
            label: 'Gemini AI',
          ),
          const NavigationDestination(
            icon: Icon(Icons.folder_rounded),
            selectedIcon: Icon(Icons.folder_rounded, color: electricCyan),
            label: 'الحالات',
          ),
          const NavigationDestination(
            icon: Icon(Icons.feed_rounded),
            selectedIcon: Icon(Icons.feed_rounded, color: electricCyan),
            label: 'الأخبار',
          ),
        ],
      ),
    );
  }
}
