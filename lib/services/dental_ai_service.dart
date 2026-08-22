import 'package:google_generative_ai/google_generative_ai.dart';

class DentalAiService {
  static const String _apiKey = String.fromEnvironment('GEMINI_API_KEY');
  late final GenerativeModel _model;

  DentalAiService() {
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: _apiKey,
      systemInstruction: Content.system(
        'أنت مساعد طبي متخصص ومحترف في طب وجراحة الفم والأسنان للدكتور مالك، تجيب بدقة ومهنية علمية واستشارات سريرية وعلاجية فورية وموثوقة.'
      ),
    );
  }

  Future<String?> askDentalQuestion(String prompt) async {
    if (_apiKey.isEmpty) {
      return 'تنبيه: مفتاح GEMINI_API_KEY غير مهيأ. يرجى تمريره عبر build-args أو GitHub Secrets.';
    }
    try {
      final response = await _model.generateContent([Content.text(prompt)]);
      return response.text;
    } catch (e) {
      return 'حدث خطأ في الاتصال بالمساعد الطبي الذكي: $e';
    }
  }
}
