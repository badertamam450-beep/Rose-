import 'dart:convert';
import 'dart:io';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

class NewsItem {
  final String title;
  final String source;
  final String date;
  final String link;
  const NewsItem({required this.title, required this.source, required this.date, required this.link});
}

class LibraryItem {
  final String title;
  final String journal;
  final String link;
  const LibraryItem({required this.title, required this.journal, required this.link});
}

class WebServices {
  static const MethodChannel _torChannel = MethodChannel('dr_malek/tor');

  Future<void> openUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return;
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<void> openGoogleSearch(String query) async {
    final uri = Uri.https('www.google.com', '/search', {'q': query});
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  // Deep Web: searches public academic and institutional sources that are
  // commonly missed by a plain web query (PubMed/WHO/FDI/Scholar).
  Future<void> openDeepWebSearch(String query) async {
    final q = query.trim().isEmpty ? 'dentistry oral health' : query.trim();
    final encoded = Uri.encodeQueryComponent(q);
    final uri = Uri.parse(
      'https://www.google.com/search?q=$encoded+site%3Apubmed.ncbi.nlm.nih.gov+OR+site%3Awho.int+OR+site%3Afdiworlddental.org+OR+site%3Ascholar.google.com',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  // Dark Web: send the search to Ahmia and explicitly request the installed
  // Tor Browser on Android. This does not embed Tor or bypass Tor Browser's
  // security model; .onion results are handled by the Tor Browser itself.
  Future<bool> openDarkWebSearch(String query) async {
    final q = query.trim().isEmpty ? 'dentistry' : query.trim();
    final uri = Uri.https('ahmia.fi', '/search/', {'q': q});
    try {
      final openedInTor = await _torChannel.invokeMethod<bool>('openTorBrowser', {'url': uri.toString()});
      if (openedInTor == true) return true;
    } on PlatformException {
      // Non-Android or an unavailable Tor Browser: fall back to the normal browser.
    } catch (_) {}
    return launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<DateTime?> fetchGoogleUtc() async {
    try {
      final response = await http.get(
        Uri.parse('https://www.google.com/generate_204'),
        headers: const {'Cache-Control': 'no-cache'},
      ).timeout(const Duration(seconds: 8));
      final value = response.headers['date'];
      if (value == null) return null;
      return HttpDate.parse(value).toUtc();
    } catch (_) {
      return null;
    }
  }

  Future<List<NewsItem>> fetchDentalNews() async {
    final feeds = <Uri>[
      Uri.https('news.google.com', '/rss/search', {'q': 'طب الأسنان اليمن', 'hl': 'ar', 'gl': 'YE', 'ceid': 'YE:ar'}),
      Uri.https('news.google.com', '/rss/search', {'q': 'dentistry dental oral health', 'hl': 'en', 'gl': 'US', 'ceid': 'US:en'}),
    ];
    final all = <NewsItem>[];
    for (final feed in feeds) {
      try {
        final response = await http.get(feed).timeout(const Duration(seconds: 10));
        if (response.statusCode == 200) all.addAll(_parseRss(response.body));
      } catch (_) {}
    }
    final seen = <String>{};
    return all.where((e) => seen.add(e.link)).take(20).toList();
  }

  List<NewsItem> _parseRss(String body) {
    final items = <NewsItem>[];
    for (final match in RegExp(r'<item>([\s\S]*?)</item>', caseSensitive: false).allMatches(body)) {
      final block = match.group(1) ?? '';
      final title = _tag(block, 'title');
      final link = _tag(block, 'link');
      final date = _tag(block, 'pubDate');
      final source = _tag(block, 'source');
      if (title.isEmpty || link.isEmpty) continue;
      items.add(NewsItem(title: _decode(title), source: _decode(source.isEmpty ? 'Google News' : source), date: date, link: _decode(link)));
    }
    return items;
  }

  String _tag(String block, String name) {
    final match = RegExp('<$name[^>]*>([\\s\\S]*?)</$name>', caseSensitive: false).firstMatch(block);
    return match?.group(1)?.trim() ?? '';
  }

  String _decode(String value) => value
      .replaceAll('&amp;', '&')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'")
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll(RegExp(r'<[^>]+>'), '');

  Future<List<LibraryItem>> searchPubMed(String query) async {
    final clean = query.trim().isEmpty ? 'dentistry' : query.trim();
    try {
      final searchUri = Uri.https('eutils.ncbi.nlm.nih.gov', '/entrez/eutils/esearch.fcgi', {
        'db': 'pubmed', 'term': clean, 'retmode': 'json', 'retmax': '12', 'sort': 'pub_date',
      });
      final searchResponse = await http.get(searchUri).timeout(const Duration(seconds: 12));
      if (searchResponse.statusCode != 200) return [];
      final ids = (jsonDecode(searchResponse.body)['esearchresult']['idlist'] as List).cast<String>();
      if (ids.isEmpty) return [];
      final summaryUri = Uri.https('eutils.ncbi.nlm.nih.gov', '/entrez/eutils/esummary.fcgi', {
        'db': 'pubmed', 'id': ids.join(','), 'retmode': 'json',
      });
      final summaryResponse = await http.get(summaryUri).timeout(const Duration(seconds: 12));
      if (summaryResponse.statusCode != 200) return [];
      final result = jsonDecode(summaryResponse.body)['result'] as Map<String, dynamic>;
      return ids.map((id) {
        final row = result[id] as Map<String, dynamic>? ?? {};
        return LibraryItem(
          title: (row['title'] ?? 'PubMed article').toString(),
          journal: (row['fulljournalname'] ?? row['source'] ?? 'PubMed').toString(),
          link: 'https://pubmed.ncbi.nlm.nih.gov/$id/',
        );
      }).toList();
    } catch (_) {
      return [];
    }
  }
}
