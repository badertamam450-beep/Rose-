import 'package:google_generative_ai/google_generative_ai.dart';

class DentalAiService {
  static const String _apiKey = String.fromEnvironment('GEMINI_API_KEY');
  late final GenerativeModel _model;

  DentalAiService() {
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: _apiKey,
      systemInstruction: Content.system(
        'أنت مساعد طبي متخصص ومحترف في طب وجراحة الفم والأسنان، تجيب بدقة ومهنية علمية.'
      ),
    );
  }

  Future<String?> askDentalQuestion(String prompt) async {
    try {
      final response = await _model.generateContent([Content.text(prompt)]);
      return response.text;
    } catch (e) {
      return 'حدث خطأ في الاتصال بالخدمة الطبية: $e';
    }
  }
}
