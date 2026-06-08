/**
 * Google Sheets integration stub for static hosting (GitHub Pages).
 *
 * Use a Google Apps Script web app as a POST endpoint, then set:
 * NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 */

export async function appendSubmission(row: Record<string, string>) {
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!url) throw new Error("NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not configured");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error("Failed to save submission");
  return res.json();
}
