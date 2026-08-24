import 'package:google_generative_ai/google_generative_ai.dart';

class DentalAiService {
  static const String _apiKey = String.fromEnvironment('GEMINI_API_KEY');
  GenerativeModel? _model;
  ChatSession? _chat;

  DentalAiService() {
    if (_apiKey.isNotEmpty) {
      _model = GenerativeModel(
        model: 'gemini-2.5-flash',
        apiKey: _apiKey,
        systemInstruction: Content.system(
          'أنت Gemini AI داخل تطبيق DR MALEK ALROMIMAH DENTAL. أجب بالعربية افتراضياً، وبأسلوب علمي واضح. ساعد طبيب الأسنان في البحث والتفكير السريري والتعليم، واذكر حدود المعلومات وضرورة الرجوع للمراجع والبروتوكولات الرسمية عند القرارات العلاجية.',
        ),
      );
      _chat = _model!.startChat();
    }
  }

  bool get isConnected => _model != null;

  Future<String?> askDentalQuestion(String prompt) async {
    if (prompt.trim().isEmpty) return 'اكتب سؤالك أولاً.';
    if (_chat == null) {
      return 'لم يتم تفعيل اتصال Gemini بعد. أضف GEMINI_API_KEY إلى GitHub Secrets ثم أعد بناء APK.';
    }
    try {
      final response = await _chat!.sendMessage(Content.text(prompt.trim()));
      return response.text ?? 'لم يصل نص من Gemini.';
    } catch (e) {
      return 'تعذر الاتصال بـ Gemini حالياً. تحقق من الإنترنت ومفتاح API.\n$e';
    }
  }
}
