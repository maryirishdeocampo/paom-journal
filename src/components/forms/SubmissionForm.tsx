"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReviewerSuggestions } from "@/components/forms/ReviewerSuggestions";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { extractKeywordsFromAbstract, mergeKeywords } from "@/lib/keywords";
import { runSubmissionAutomation } from "@/lib/submission-automation";
import { addSubmission } from "@/lib/store";
import type { ReviewerSuggestion } from "@/lib/reviewer-matching";
import type { ManuscriptFile } from "@/lib/types";
import { generateTrackingCode } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  authors: z.string().min(1, "At least one author is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
  email: z.string().email("Valid email is required"),
  abstract: z
    .string()
    .min(100, "Abstract must be at least 100 characters")
    .max(3000, "Abstract must not exceed 3000 characters"),
  keywords: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function SubmissionForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [reviewerSuggestions, setReviewerSuggestions] = useState<ReviewerSuggestion[]>([]);
  const [finalKeywords, setFinalKeywords] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const abstractValue = watch("abstract");
  const titleValue = watch("title");

  const runKeywordSuggestion = useCallback(() => {
    const abstract = getValues("abstract");
    const title = getValues("title");
    if (!abstract || abstract.length < 50) return;
    const extracted = extractKeywordsFromAbstract(abstract, title);
    setSuggestedKeywords(extracted);
  }, [getValues]);

  const applySuggestedKeywords = () => {
    const current = getValues("keywords") ?? "";
    const merged = mergeKeywords(current, suggestedKeywords);
    setValue("keywords", merged.join(", "));
  };

  const readFileAsDataUrl = (file: File): Promise<ManuscriptFile> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          dataUrl: reader.result as string,
        });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setFileError("");
    const code = generateTrackingCode();

    const automation = runSubmissionAutomation({
      title: data.title,
      abstract: data.abstract,
      keywords: data.keywords,
    });

    setFinalKeywords(automation.keywords);
    setReviewerSuggestions(automation.suggestedReviewers);

    let manuscript: ManuscriptFile | undefined;
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        setFileError("File must be under 4MB for browser storage. Try a smaller PDF.");
        setIsSubmitting(false);
        return;
      }
      try {
        manuscript = await readFileAsDataUrl(selectedFile);
      } catch {
        setFileError("Could not read file. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    addSubmission({
      id: code,
      trackingCode: code,
      title: data.title,
      authors: data.authors.split(",").map((a) => a.trim()),
      affiliation: data.affiliation,
      abstract: data.abstract,
      keywords: automation.keywords,
      status: "submitted",
      submittedAt: new Date().toISOString(),
      email: data.email,
      manuscript,
      suggestedReviewerIds: automation.suggestedReviewers.map((s) => s.reviewer.id),
    });

    setTrackingCode(code);
    setShowSuccess(true);
    setIsSubmitting(false);
    reset();
    setFileName("");
    setSelectedFile(null);
    setSuggestedKeywords([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(trackingCode);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paper Details</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              id="title"
              label="Research Title *"
              placeholder="Enter the full title of your research paper"
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              id="authors"
              label="Authors *"
              placeholder="e.g. Maria Santos, Juan Dela Cruz"
              error={errors.authors?.message}
              {...register("authors")}
            />
            <Input
              id="affiliation"
              label="Affiliation *"
              placeholder="University or institution"
              error={errors.affiliation?.message}
              {...register("affiliation")}
            />
            <Input
              id="email"
              label="Corresponding Email *"
              type="email"
              placeholder="author@university.edu.ph"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abstract & Keywords</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Textarea
              id="abstract"
              label="Abstract *"
              placeholder="Provide a comprehensive abstract (100–3000 characters)"
              rows={6}
              error={errors.abstract?.message}
              {...register("abstract", {
                onBlur: runKeywordSuggestion,
              })}
            />
            {(abstractValue?.length ?? 0) >= 50 && (
              <div className="rounded-xl border border-paom-blue/20 bg-paom-blue/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-paom-blue">
                    <Sparkles className="h-4 w-4" />
                    Auto-keyword detection
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={runKeywordSuggestion}>
                    Detect from abstract
                  </Button>
                </div>
                {suggestedKeywords.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-lg bg-card px-2 py-0.5 text-xs text-foreground"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 px-0 text-paom-blue"
                      onClick={applySuggestedKeywords}
                    >
                      Apply to keywords field
                    </Button>
                  </div>
                )}
              </div>
            )}
            <Input
              id="keywords"
              label="Keywords (optional — auto-filled from abstract if empty)"
              placeholder="Leave blank to auto-extract on submit, or enter your own"
              error={errors.keywords?.message}
              {...register("keywords")}
            />
            {titleValue && abstractValue && abstractValue.length >= 100 && (
              <p className="text-xs text-muted">
                On submit, keywords will be extracted from your abstract and matched to
                suitable reviewers automatically.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manuscript Upload</CardTitle>
          </CardHeader>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/50 p-8 transition-colors hover:border-paom-blue/50 hover:bg-paom-blue/5">
            <FileUp className="mb-3 h-10 w-10 text-muted" />
            <p className="text-sm font-medium">
              {fileName || "Click to upload manuscript (PDF, DOCX)"}
            </p>
            <p className="mt-1 text-xs text-muted">PDF or DOCX, max 4MB</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
                setFileName(file?.name ?? "");
                setFileError("");
              }}
            />
          </label>
          {fileError && <p className="mt-2 text-xs text-paom-red">{fileError}</p>}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Manuscript"
            )}
          </Button>
        </div>
      </form>

      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Submission Successful!"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <span className="text-2xl">✓</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Your manuscript was submitted. Reviewer suggestions were generated
              automatically from your abstract.
            </p>
            <div className="mt-4 rounded-xl bg-background p-4">
              <p className="text-xs text-muted">Tracking Code</p>
              <p className="mt-1 font-mono text-lg font-bold text-paom-blue">{trackingCode}</p>
            </div>
          </div>

          <ReviewerSuggestions
            suggestions={reviewerSuggestions}
            extractedKeywords={finalKeywords}
          />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={copyCode}>
              Copy Code
            </Button>
            <Button className="flex-1" href={`/my-submissions?code=${trackingCode}`}>
              Track Submission
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
