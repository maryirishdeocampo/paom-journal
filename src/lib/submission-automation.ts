import { extractKeywordsFromAbstract, mergeKeywords } from "./keywords";
import { reviewers } from "./mock-data";
import { suggestReviewers, type ReviewerSuggestion } from "./reviewer-matching";
import type { Submission } from "./types";

export interface AutomatedSubmissionResult {
  keywords: string[];
  extractedKeywords: string[];
  suggestedReviewers: ReviewerSuggestion[];
}

/**
 * Run the full post-submission automation pipeline:
 * 1. Extract keywords from abstract (+ title)
 * 2. Merge with any user-provided keywords
 * 3. Match and rank reviewers by expertise
 */
export function runSubmissionAutomation(input: {
  title: string;
  abstract: string;
  keywords?: string | string[];
}): AutomatedSubmissionResult {
  const extracted = extractKeywordsFromAbstract(input.abstract, input.title);
  const userKw =
    typeof input.keywords === "string"
      ? input.keywords
      : (input.keywords ?? []).join(", ");
  const keywords = mergeKeywords(userKw, extracted);
  const suggestedReviewers = suggestReviewers(keywords, reviewers, 3);

  return { keywords, extractedKeywords: extracted, suggestedReviewers };
}

export function getTopReviewerName(result: AutomatedSubmissionResult): string {
  return result.suggestedReviewers[0]?.reviewer.name ?? "—";
}

export function automateExistingSubmission(submission: Submission): AutomatedSubmissionResult {
  return runSubmissionAutomation({
    title: submission.title,
    abstract: submission.abstract,
    keywords: submission.keywords,
  });
}
