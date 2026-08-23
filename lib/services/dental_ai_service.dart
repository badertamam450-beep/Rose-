import 'package:google_generative_ai/google_generative_ai.dart';

class DentalAiService {
  static const String _apiKey = String.fromEnvironment('GEMINI_API_KEY');
  late final GenerativeModel? _model;

  DentalAiService() {
    if (_apiKey.isNotEmpty) {
      _model = GenerativeModel(
        model: 'gemini-1.5-flash',
        apiKey: _apiKey,
        systemInstruction: Content.system(
          'أنت مساعد طبي متخصص ومحترف في طب وجراحة الفم والأسنان للدكتور مالك في تطبيق My Rose Dental، تجيب بدقة ومهنية علمية واستشارات سريرية وتشخيصات فارقة وخطط علاج فورية وموثوقة.'
        ),
      );
    } else {
      _model = null;
    }
  }

  Future<String?> askDentalQuestion(String prompt) async {
    if (_model == null) {
      return 'مرحباً دكتور مالك.\nبناءً على استشارتك: "$prompt"\n\n- التشخيص السريري المقترح: تقييم سريري وشعاعي دقيق (CBCT) مع فحص الأنسجة حول السنية.\n- الخطة العلاجية المقترحة: متابعة بروتوكول التخدير الموضعي وتطبيق المعالجة التحفظية/الجراحية وفق المعايير الطبية المعتمدة.\n- ملاحظة: عند تفعيل مفتاح GEMINI_API_KEY ستحصل على تحليل مدعوم حياً بالذكاء الاصطناعي.';
    }
    try {
      final response = await _model!.generateContent([Content.text(prompt)]);
      return response.text ?? 'لم يتم استلام نص من المساعد الطبي.';
    } catch (e) {
      return 'حدث خطأ أثناء معالجة الاستشارة: $e';
    }
  }
}
