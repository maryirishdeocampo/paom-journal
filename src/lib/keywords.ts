const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might", "must",
  "shall", "can", "this", "that", "these", "those", "it", "its", "they", "them",
  "their", "we", "our", "he", "she", "his", "her", "which", "who", "whom", "what",
  "when", "where", "why", "how", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "just", "also", "into", "over", "after", "before", "between",
  "through", "during", "about", "against", "among", "while", "within", "without",
  "under", "again", "further", "then", "once", "here", "there", "any", "both",
  "study", "paper", "research", "analysis", "examines", "investigates", "explores",
  "findings", "results", "conclusion", "introduction", "methodology", "data",
  "using", "used", "based", "among", "across", "however", "therefore", "thus",
]);

/** Known domain terms to prefer as multi-word phrases */
const DOMAIN_PHRASES = [
  "digital transformation",
  "supply chain",
  "corporate governance",
  "organizational behavior",
  "human resources",
  "work life balance",
  "firm performance",
  "small and medium enterprises",
  "southeast asia",
  "financial inclusion",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Extract keywords from abstract (and optional title) using frequency + domain phrases.
 */
export function extractKeywordsFromAbstract(
  abstract: string,
  title = "",
  maxKeywords = 6
): string[] {
  const combined = `${title} ${abstract}`.toLowerCase();
  const foundPhrases: string[] = [];

  for (const phrase of DOMAIN_PHRASES) {
    if (combined.includes(phrase)) {
      foundPhrases.push(phrase);
    }
  }

  const words = tokenize(`${title} ${abstract}`);
  const freq = new Map<string, number>();

  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }

  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  const merged = [...foundPhrases];
  for (const word of ranked) {
    if (merged.length >= maxKeywords) break;
    if (!merged.some((k) => k.includes(word) || word.includes(k))) {
      merged.push(word);
    }
  }

  return merged.slice(0, maxKeywords);
}

export function mergeKeywords(
  userKeywords: string,
  extracted: string[]
): string[] {
  const manual = userKeywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const combined = [...manual];
  for (const kw of extracted) {
    const lower = kw.toLowerCase();
    if (!combined.some((k) => k === lower || k.includes(lower) || lower.includes(k))) {
      combined.push(lower);
    }
  }
  return combined;
}
