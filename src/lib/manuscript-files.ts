import type { ManuscriptFile, SubmissionManuscripts } from "./types";

export function resolveManuscriptMimeType(file: ManuscriptFile): string {
  if (file.fileType && file.fileType !== "application/octet-stream") {
    return file.fileType;
  }

  const name = file.fileName.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (name.endsWith(".doc")) return "application/msword";
  return "application/octet-stream";
}

export function normalizeManuscriptFiles(
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

export function createPreviewUrl(file: ManuscriptFile): { url: string; revoke: boolean } {
  const dataUrl = file.dataUrl?.trim();
  if (!dataUrl) {
    throw new Error("Missing file data");
  }

  if (!dataUrl.startsWith("data:")) {
    return { url: dataUrl, revoke: false };
  }

  try {
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex < 0) throw new Error("Invalid data URL");

    const header = dataUrl.slice(0, commaIndex);
    const payload = dataUrl.slice(commaIndex + 1).replace(/\s/g, "");
    
    // Validate base64 payload
    if (header.includes(";base64")) {
      try {
        atob(payload);
      } catch {
        throw new Error("Invalid base64 data");
      }
    }
    
    const binary = header.includes(";base64")
      ? atob(payload)
      : decodeURIComponent(payload);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const mime = resolveManuscriptMimeType(file);
    const blob = new Blob([bytes], { type: mime });

    return { url: URL.createObjectURL(blob), revoke: true };
  } catch (err) {
    console.error("Failed to create preview URL:", err);
    // Return original data URL as fallback
    return { url: dataUrl, revoke: false };
  }
}

export function readUploadAsManuscriptFile(file: File): Promise<ManuscriptFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const name = file.name.toLowerCase();
      let fileType = file.type || "application/octet-stream";
      if (name.endsWith(".pdf")) fileType = "application/pdf";
      if (name.endsWith(".docx")) {
        fileType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      resolve({
        fileName: file.name,
        fileType,
        dataUrl: reader.result as string,
      });
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
