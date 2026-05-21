export function stripHtml(html: string | undefined | null): string {
  if (!html) return ""
  return html.replace(/<[^>]*>?/gm, "").trim()
}
