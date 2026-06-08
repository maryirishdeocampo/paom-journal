"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
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
  keywords: z.string().min(1, "At least one keyword is required"),
});

type FormData = z.infer<typeof schema>;

export function SubmissionForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const code = generateTrackingCode();

    // Static hosting (GitHub Pages) has no server — persist locally for demo.
    // Replace with Supabase / Google Sheets client calls in production.
    try {
      const stored = JSON.parse(localStorage.getItem("paom-submissions") ?? "[]");
      stored.push({ ...data, trackingCode: code, fileName, submittedAt: new Date().toISOString() });
      localStorage.setItem("paom-submissions", JSON.stringify(stored));
    } catch {
      // localStorage unavailable — still show tracking code
    }

    setTrackingCode(code);
    setShowSuccess(true);
    setIsSubmitting(false);
    reset();
    setFileName("");
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
              {...register("abstract")}
            />
            <Input
              id="keywords"
              label="Keywords *"
              placeholder="e.g. management, leadership, Philippines (comma-separated)"
              error={errors.keywords?.message}
              {...register("keywords")}
            />
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
            <p className="mt-1 text-xs text-muted">Maximum file size: 10MB</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
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

      <Modal open={showSuccess} onClose={() => setShowSuccess(false)} title="Submission Successful!">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-muted">
            Your manuscript has been submitted successfully. Save your tracking code to check
            status later.
          </p>
          <div className="rounded-xl bg-background p-4">
            <p className="text-xs text-muted">Tracking Code</p>
            <p className="mt-1 font-mono text-lg font-bold text-paom-blue">{trackingCode}</p>
          </div>
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
