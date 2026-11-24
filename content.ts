export const MOTIVATION = [
  "Küçük adımlar, büyük bir evren kurar.", "Bugün 15 dakika, yarın 15 kelime.", "Hata yapmak öğrenmenin ışığıdır.",
  "Düzenli çalışmak, yoğun çalışmaktan daha parlaktır.", "Her yeni kelime, evrenine bir yıldız ekler.",
  "Dün olduğundan bir adım ileridesin.", "Sabır, dil öğreniminin sessiz süper gücüdür."
];
export type DailyWord = { word: string; type: string; meaning_en: string; meaning_tr: string; example: string; example_tr: string; cefr: string };
export const WORDS: DailyWord[] = [
  { word: "resilient", type: "adjective", meaning_en: "able to recover quickly from difficulties", meaning_tr: "dirençli, çabuk toparlanan", example: "Children are often more resilient than adults expect.", example_tr: "Çocuklar çoğu zaman yetişkinlerin sandığından daha dirençlidir.", cefr: "C1" },
  { word: "reluctant", type: "adjective", meaning_en: "unwilling and hesitant", meaning_tr: "isteksiz", example: "She was reluctant to speak in front of the class.", example_tr: "Sınıfın önünde konuşmaya isteksizdi.", cefr: "B2" },
  { word: "gather", type: "verb", meaning_en: "to bring together or collect", meaning_tr: "toplamak, bir araya gelmek", example: "We gathered information before the exam.", example_tr: "Sınavdan önce bilgi topladık.", cefr: "B1" },
  { word: "significant", type: "adjective", meaning_en: "important or noticeably large", meaning_tr: "önemli, kayda değer", example: "There was a significant increase in sales.", example_tr: "Satışlarda kayda değer bir artış oldu.", cefr: "B2" },
  { word: "overcome", type: "verb", meaning_en: "to succeed in dealing with a problem", meaning_tr: "üstesinden gelmek", example: "He overcame his fear of flying.", example_tr: "Uçma korkusunun üstesinden geldi.", cefr: "B2" },
  { word: "attitude", type: "noun", meaning_en: "a way of thinking or feeling about something", meaning_tr: "tutum", example: "A positive attitude helps you learn faster.", example_tr: "Olumlu bir tutum daha hızlı öğrenmene yardım eder.", cefr: "B1" },
  { word: "mitigate", type: "verb", meaning_en: "to make something less severe", meaning_tr: "hafifletmek", example: "Trees help mitigate the effects of heat.", example_tr: "Ağaçlar sıcağın etkilerini hafifletmeye yardım eder.", cefr: "C1" }
];
export const dayIndex = (d = new Date()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
