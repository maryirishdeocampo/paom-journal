import type { Reviewer } from "./types";

export interface ReviewerSuggestion {
  reviewer: Reviewer;
  score: number;
  matchedExpertise: string[];
  reason: string;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function keywordMatchesExpertise(keyword: string, expertise: string): boolean {
  const k = normalize(keyword);
  const e = normalize(expertise);
  return e.includes(k) || k.includes(e) || e.split(/\s+/).some((w) => k.includes(w) && w.length > 3);
}

/**
 * Score and rank reviewers based on keyword overlap with expertise tags.
 */
export function suggestReviewers(
  keywords: string[],
  reviewers: Reviewer[],
  limit = 3
): ReviewerSuggestion[] {
  const suggestions = reviewers.map((reviewer) => {
    const matchedExpertise = reviewer.expertise.filter((exp) =>
      keywords.some((kw) => keywordMatchesExpertise(kw, exp))
    );

    let score = matchedExpertise.length * 10;

    for (const kw of keywords) {
      for (const exp of reviewer.expertise) {
        if (keywordMatchesExpertise(kw, exp)) {
          score += 5;
        }
      }
    }

    if (reviewer.availability === "available") score += 8;
    if (reviewer.availability === "limited") score += 3;
    if (reviewer.availability === "unavailable") score -= 20;

    score -= reviewer.activeReviews * 2;

    const reason =
      matchedExpertise.length > 0
        ? `Matches: ${matchedExpertise.join(", ")}`
        : "General fit based on profile";

    return { reviewer, score, matchedExpertise, reason };
  });

  return suggestions
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
