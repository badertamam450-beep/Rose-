# 🌸 My Rose Dental (روز دينتال)
> المنظومة الطبية السريرية والذكية المتخصصة في طب وجراحة الفم والأسنان — للدكتور مالك.

![Android 15](https://img.shields.io/badge/Android-15_(SDK_35)-00E5FF?style=for-the-badge&logo=android&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-3.19+-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5_Flash-FF4081?style=for-the-badge&logo=google&logoColor=white)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-Automated_APK_Build-00C853?style=for-the-badge&logo=githubactions&logoColor=white)

---

## 🌟 نظرة عامة (Overview)

تطبيق **My Rose Dental (روز دينتال)** هو بيئة عمل طبية متكاملة مصممة خصيصاً للدكتور مالك، تجمع بين واجهة مستخدم ثلاثية الأبعاد (3D Glassmorphism & Neural Core) ونظام ذكاء اصطناعي سريري مدعوم بنماذج **Gemini AI** للإجابة الفورية عن الاستشارات الجراحية، التخطيط السريري، وإدارة سجلات الحالات والمكتبة الرقمية.

---

## ✨ المميزات الرئيسية (Core Features)

### 1. الهيدر وشعار الوردة الكريستالية (Neural Crown)
- شعار نيون كريستالي ثلاثي الأبعاد بلون الورد المرجاني والأزرق السماوي الكهربائي.
- مؤشر توافق فوري مع نظام **Android 15 (SDK 35)**.

### 2. هولوجرام الترحيب والذكاء الاصطناعي (AI Welcome Hub)
- بطاقة ترحيب مخصصة: *"مرحباً بك، دكتور مالك"*.
- رأس ذكاء اصطناعي تفاعلي ثلاثي الأبعاد مع حلقة طاقة دوارة لبدء الاستشارة الطبية فوراً.

### 3. الأعمدة الأربعة للتحكم السريع (The 4 Pillars)
1. 🟦 **المكتبة الرقمية (Digital Library):** تصفح الكتب، المراجع الجراحية، وملفات الـ PDF/DOCX/PPT.
2. 🟥 **الاستشارة الذكية (Smart AI Consultation):** محادثة سريرية مباشرة مع Gemini AI للحصول على تشخيصات فارقة (Differential Diagnosis) وخطط علاج فورية.
3. 🟩 **آخر الأخبار (Latest News):** متابعة أحدث أبحاث، تقنيات، ومؤتمرات طب الأسنان العالمية والمحلية.
4. 🟨 **حالاتي الخاصة (Private Patient Cases):** أرشفة ومتابعة سجلات المرضى والخطط العلاجية وتفاصيل الزرع والتقويم.

### 4. أحدث المستندات والوسائط (Media & Docs Scroll)
- شريط أفقي لاستعراض المراجع الحديثة مثل:
  - 📕 **الجراحة المعاصرة - المجلد الأول** (PDF).
  - 🎬 **تقنية زراعة الأسنان الفورية** (MP4).

### 5. شريط التنقل السفلي المنحني (Bottom Navigation Bar)
- شريط ملاحة زجاجي منحني يضم 5 أقسام رئيسية يتوسطها زر **Gemini AI** المتوهج.

---

## 🏗️ هيكلية المشروع (Project Architecture)

```text
Rose-/
├── .github/
│   └── workflows/
│       └── android_build.yml     # أتمتة بناء وتصدير ملف الـ APK عبر GitHub Actions
├── android/                      # إعدادات نظام أندرويد 15 (SDK 35) و Gradle
│   ├── app/
│   │   ├── src/main/AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
├── lib/                          # الكود المصدري لتطبيق Flutter
│   ├── services/
│   │   └── dental_ai_service.dart # تكامل Gemini AI مع التوجيه السريري المخصص
│   └── main.dart                 # واجهة المستخدم ثلاثية الأبعاد والشاشات
├── assets/                       # الأيقونات والخطوط والوسائط
├── pubspec.yaml                  # التبعيات ومكتبات Flutter
└── README.md                     # التوثيق الرسمي للمشروع
