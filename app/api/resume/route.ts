import { resumeText } from "@/lib/resume";

// Plain-text résumé for ATS forms, which routinely turn PDF columns into
// scrambled text. Same source of truth as the site and the print page.
export function GET() {
  return new Response(resumeText(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
