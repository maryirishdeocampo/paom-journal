"use client";

import { Download, ExternalLink, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ManuscriptFile, SubmissionManuscripts } from "@/lib/types";
import {
  createPreviewUrl,
  normalizeManuscriptFiles,
  resolveManuscriptMimeType,
} from "@/lib/manuscript-files";
import { Button } from "@/components/ui/Button";

interface ManuscriptViewerProps {
  open: boolean;
  onClose: () => void;
  manuscripts?: SubmissionManuscripts;
  /** @deprecated legacy single file */
  manuscript?: ManuscriptFile;
  title?: string;
}

export function ManuscriptViewer({
  open,
  onClose,
  manuscripts,
  manuscript,
  title,
}: ManuscriptViewerProps) {
  const files = useMemo(
    () => normalizeManuscriptFiles(manuscripts, manuscript),
    [manuscript, manuscripts]
  );
  const [activeTab, setActiveTab] = useState<"pdf" | "docx">("pdf");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    if (!open || !files.pdf) {
      setPdfUrl("");
      setPdfError("");
      return;
    }

    let preview: { url: string; revoke: boolean } | null = null;

    try {
      preview = createPreviewUrl(files.pdf);
      setPdfUrl(preview.url);
      setPdfError("");
    } catch (err) {
      console.error("PDF preview error:", err);
      setPdfUrl("");
      setPdfError("This PDF could not be loaded. The stored file may be incomplete or corrupted.");
    }

    return () => {
      if (preview?.revoke && preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [files.pdf, open]);

  useEffect(() => {
    if (open && !files.pdf && files.docx) setActiveTab("docx");
    if (open && files.pdf) setActiveTab("pdf");
  }, [files.docx, files.pdf, open]);

  const download = (file: ManuscriptFile, url?: string) => {
    const href = url ?? createPreviewUrl(file).url;
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = file.fileName;
    anchor.click();
  };

  const hasPdf = !!files.pdf;
  const hasDocx = !!files.docx;
  const hasAny = hasPdf || hasDocx;
  const activeFile = activeTab === "pdf" ? files.pdf : files.docx;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h2 className="font-semibold">{title ?? "Manuscript"}</h2>
                <p className="text-xs text-muted">
                  {hasPdf && hasDocx
                    ? "PDF and DOCX on file"
                    : hasPdf
                      ? "PDF only"
                      : hasDocx
                        ? "DOCX only"
                        : "No files"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-background"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {hasAny && (
              <div className="flex gap-2 border-b border-border px-4 pt-2">
                {hasPdf && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("pdf")}
                    className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                      activeTab === "pdf"
                        ? "bg-background text-paom-blue"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    PDF
                  </button>
                )}
                {hasDocx && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("docx")}
                    className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                      activeTab === "docx"
                        ? "bg-background text-paom-blue"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    DOCX
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-auto p-4">
              {!hasAny ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted">
                  <FileText className="mb-3 h-12 w-12" />
                  <p>No manuscript files uploaded for this submission.</p>
                </div>
              ) : activeTab === "pdf" && files.pdf ? (
                pdfUrl ? (
                  <iframe
                    src={`${pdfUrl}#view=FitH`}
                    title={files.pdf.fileName}
                    className="h-[70vh] w-full rounded-xl border border-border bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="mb-3 h-12 w-12 text-paom-red" />
                    <p className="font-medium">PDF preview unavailable</p>
                    <p className="mt-2 max-w-sm text-sm text-muted">
                      {pdfError || "Preparing the PDF preview…"}
                    </p>
                    {files.pdf && (
                      <Button
                        className="mt-4"
                        onClick={() => download(files.pdf!)}
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                )
              ) : activeFile ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="mb-3 h-12 w-12 text-paom-blue" />
                  <p className="font-medium">{activeFile.fileName}</p>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Word documents cannot be previewed in the browser. Download the
                    file to view it.
                  </p>
                  <Button className="mt-4" onClick={() => download(activeFile)}>
                    <Download className="h-4 w-4" />
                    Download {activeFile.fileName}
                  </Button>
                </div>
              ) : null}
            </div>

            {activeFile && activeTab === "pdf" && files.pdf && (
              <div className="flex flex-wrap gap-2 border-t border-border p-4">
                {pdfUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open PDF
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => download(files.pdf!, pdfUrl || undefined)}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <p className="w-full text-[10px] text-muted">
                  {resolveManuscriptMimeType(files.pdf)}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
