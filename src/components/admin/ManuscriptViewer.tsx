"use client";

import { Download, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ManuscriptFile, SubmissionManuscripts } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ManuscriptViewerProps {
  open: boolean;
  onClose: () => void;
  manuscripts?: SubmissionManuscripts;
  /** @deprecated legacy single file */
  manuscript?: ManuscriptFile;
  title?: string;
}

function normalizeManuscripts(
  manuscripts?: SubmissionManuscripts,
  legacy?: ManuscriptFile
): SubmissionManuscripts {
  const result: SubmissionManuscripts = { ...manuscripts };
  if (legacy && !result.pdf && !result.docx) {
    const isPdf =
      legacy.fileType === "application/pdf" ||
      legacy.fileName.toLowerCase().endsWith(".pdf");
    if (isPdf) result.pdf = legacy;
    else result.docx = legacy;
  }
  return result;
}

export function ManuscriptViewer({
  open,
  onClose,
  manuscripts,
  manuscript,
  title,
}: ManuscriptViewerProps) {
  const files = normalizeManuscripts(manuscripts, manuscript);
  const [activeTab, setActiveTab] = useState<"pdf" | "docx">("pdf");

  const download = (file: ManuscriptFile) => {
    const a = document.createElement("a");
    a.href = file.dataUrl;
    a.download = file.fileName;
    a.click();
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
                <iframe
                  src={files.pdf.dataUrl}
                  title={files.pdf.fileName}
                  className="h-[70vh] w-full rounded-xl border border-border"
                />
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
              <div className="border-t border-border p-4">
                <Button variant="outline" size="sm" onClick={() => download(files.pdf!)}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
