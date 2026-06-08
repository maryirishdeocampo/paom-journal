"use client";

import { Download, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ManuscriptFile } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ManuscriptViewerProps {
  open: boolean;
  onClose: () => void;
  manuscript?: ManuscriptFile;
  title?: string;
}

export function ManuscriptViewer({ open, onClose, manuscript, title }: ManuscriptViewerProps) {
  const isPdf =
    manuscript?.fileType === "application/pdf" ||
    manuscript?.fileName?.toLowerCase().endsWith(".pdf");

  const download = () => {
    if (!manuscript) return;
    const a = document.createElement("a");
    a.href = manuscript.dataUrl;
    a.download = manuscript.fileName;
    a.click();
  };

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
                {manuscript && (
                  <p className="text-xs text-muted">{manuscript.fileName}</p>
                )}
              </div>
              <div className="flex gap-2">
                {manuscript && (
                  <Button variant="outline" size="sm" onClick={download}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 hover:bg-background"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {!manuscript ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted">
                  <FileText className="mb-3 h-12 w-12" />
                  <p>No manuscript file uploaded for this submission.</p>
                </div>
              ) : isPdf ? (
                <iframe
                  src={manuscript.dataUrl}
                  title={manuscript.fileName}
                  className="h-[70vh] w-full rounded-xl border border-border"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="mb-3 h-12 w-12 text-paom-blue" />
                  <p className="font-medium">{manuscript.fileName}</p>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    Word documents cannot be previewed in the browser. Download the
                    file to view it.
                  </p>
                  <Button className="mt-4" onClick={download}>
                    <Download className="h-4 w-4" />
                    Download {manuscript.fileName}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
