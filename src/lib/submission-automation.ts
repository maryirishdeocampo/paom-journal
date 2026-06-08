import { extractKeywordsFromAbstract, mergeKeywords } from "./keywords";
import { getReviewers } from "./store";
import { suggestReviewers, type ReviewerSuggestion } from "./reviewer-matching";
import type { Submission } from "./types";

export interface AutomatedSubmissionResult {
  keywords: string[];
  extractedKeywords: string[];
  suggestedReviewers: ReviewerSuggestion[];
}

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
  const suggestedReviewers = suggestReviewers(keywords, getReviewers(), 3);

  return { keywords, extractedKeywords: extracted, suggestedReviewers };
}

export function automateExistingSubmission(submission: Submission): AutomatedSubmissionResult {
  return runSubmissionAutomation({
    title: submission.title,
    abstract: submission.abstract,
    keywords: submission.keywords,
  });
}
