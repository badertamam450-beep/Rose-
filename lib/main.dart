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
        fontFamily: 'Roboto',
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
  String? _lastAiResponse;

  // الألوان البراقة الخاصة بهوية My Rose Dental
  static const Color electricCyan = Color(0xFF00E5FF);
  static const Color vibrantRose = Color(0xFFFF4081);
  static const Color emeraldGreen = Color(0xFF00C853);
  static const Color metallicGold = Color(0xFFFFD700);
  static const Color darkSlate = Color(0xFF0F172A);

  void _openAIConsultationDialog() {
    final TextEditingController queryController = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
            top: 20,
            left: 20,
            right: 20,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
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
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [vibrantRose, electricCyan],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.auto_awesome, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'استشارة Gemini AI الطبية',
                        style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: darkSlate),
                      ),
                      Text(
                        'المساعد الطبي الذكي للدكتور مالك',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: queryController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'اكتب استشارتك الطبية حول تشخيص، خطة علاج، أو جراحة...',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: electricCyan, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              if (_isLoadingAi)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(color: vibrantRose),
                  ),
                )
              else
                ElevatedButton(
                  onPressed: () async {
                    if (queryController.text.trim().isEmpty) return;
                    setModalState(() => _isLoadingAi = true);
                    final prompt = queryController.text.trim();
                    final reply = await _aiService.askDentalQuestion(prompt);
                    setModalState(() {
                      _isLoadingAi = false;
                      _lastAiResponse = reply;
                    });
                    setState(() {
                      _lastAiResponse = reply;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: darkSlate,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedCornerShape(16),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.send_rounded, color: electricCyan),
                      SizedBox(width: 8),
                      Text('إرسال الاستشارة الطبية', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              if (_lastAiResponse != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: emeraldGreen.withOpacity(0.3)),
                  ),
                  child: Text(
                    _lastAiResponse!,
                    style: const TextStyle(fontSize: 13, color: Color(0xFF166534), height: 1.5),
                  ),
                ),
              ],
            ],
          ),
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
              // 1. شريط العنوان (Header - The Neural Crown)
              _buildHeader(),
              const SizedBox(height: 16),

              // 2. قسم الترحيب والذكاء الاصطناعي (AI Welcome Hub)
              _buildWelcomeCard(),
              const SizedBox(height: 20),

              // 3. لوحة التحكم السريعة - الأعمدة الأربعة (The Pillars)
              _buildPillarsGrid(),
              const SizedBox(height: 24),

              // 4. قسم أحدث المستندات والفيديوهات (Updated Library)
              _buildMediaSection(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // 1. الهيدر وشعار الوردة الكريستالية
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
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
                'My Rose Dental',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: darkSlate),
              ),
              Text(
                'روز دينتال - المنظومة الذكية',
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

  // 2. بطاقة الترحيب وهولوجرام الذكاء الاصطناعي
  Widget _buildWelcomeCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: vibrantRose.withOpacity(0.12),
            blurRadius: 24,
            offset: const Offset(0, 8),
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
            'مساعدك الذكي جاهز لأي استشارة طبيّة',
            style: TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 18),
          GestureDetector(
            onTap: _openAIConsultationDialog,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const SweepGradient(
                      colors: [electricCyan, vibrantRose, electricCyan],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: electricCyan.withOpacity(0.4),
                        blurRadius: 20,
                        spreadRadius: 2,
                      )
                    ],
                  ),
                ),
                Container(
                  width: 88,
                  height: 88,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: darkSlate,
                  ),
                  child: const Icon(
                    Icons.psychology_rounded,
                    color: electricCyan,
                    size: 48,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          TextButton.icon(
            onPressed: _openAIConsultationDialog,
            icon: const Icon(Icons.touch_app, size: 16, color: vibrantRose),
            label: const Text('اضغط لبدء استشارة سريرية فورية', style: TextStyle(color: vibrantRose, fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // 3. الأعمدة المعمارية الأربعة
  Widget _buildPillarsGrid() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildPillarButton(
          title: 'المكتبة\nالرقمية',
          icon: Icons.menu_book_rounded,
          color: electricCyan,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('فتح المكتبة الرقمية الطبية...')),
            );
          },
        ),
        _buildPillarButton(
          title: 'الاستشارة\nالذكية',
          icon: Icons.mic_rounded,
          color: vibrantRose,
          onTap: _openAIConsultationDialog,
        ),
        _buildPillarButton(
          title: 'آخر\nالأخبار',
          icon: Icons.feed_rounded,
          color: emeraldGreen,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('جاري جلب أحدث أخبار طب الأسنان...')),
            );
          },
        ),
        _buildPillarButton(
          title: 'حالاتي\nالخاصة',
          icon: Icons.folder_shared_rounded,
          color: metallicGold,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('فتح سجلات وملفات الحالات...')),
            );
          },
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
              color: color.withOpacity(0.1),
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
                    color: color.withOpacity(0.4),
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

  // 4. قسم المستندات والوسائط
  Widget _buildMediaSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'أحدث المستندات والفيديوهات',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: darkSlate),
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildMediaCard(
                title: 'الجراحة المعاصرة - المجلد الأول',
                tag: 'PDF',
                accentColor: const Color(0xFFE11D48),
                icon: Icons.picture_as_pdf_rounded,
              ),
              const SizedBox(width: 14),
              _buildMediaCard(
                title: 'تقنية زراعة الأسنان الفورية',
                tag: 'MP4',
                accentColor: metallicGold,
                icon: Icons.play_circle_fill_rounded,
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
  }) {
    return Container(
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
    );
  }

  // 5. شريط التنقل السفلي المنحني
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
          if (idx == 2) {
            _openAIConsultationDialog();
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
            icon: Icon(Icons.settings_rounded),
            selectedIcon: Icon(Icons.settings_rounded, color: electricCyan),
            label: 'الإعدادات',
          ),
        ],
      ),
    );
  }
}
