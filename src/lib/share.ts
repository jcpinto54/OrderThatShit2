/**
 * Share links.
 *
 * A verdict lives at /v/<id>/ and a certificate at /c/, both of which are real
 * pre-built HTML files with their own preview image, so pasting one into Slack
 * or X shows the verdict rather than the homepage card. See
 * scripts/build-share-pages.mjs.
 *
 * The visitor's own words ride along in ?p= / ?i= and are rendered on the page
 * only — never into the preview image, which is pre-rendered per verdict. That
 * keeps the whole thing free at any scale, and stops anyone from crafting a
 * link that makes our domain serve a preview card with their text on it.
 */

/** Long enough for a real problem, short enough to stay a link. */
export const MAX_SHARED_TEXT = 80;

/** Collapse whitespace, drop control characters, and cap the length. */
export function cleanShared(raw: string): string {
  return raw
    .replace(/[\p{C}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SHARED_TEXT);
}

function origin(): string {
  return typeof window === "undefined" ? "https://orderthatshit.com" : window.location.origin;
}

export function verdictShareUrl(id: string, problem: string): string {
  const p = cleanShared(problem);
  return `${origin()}/v/${id}/${p ? `?p=${encodeURIComponent(p)}` : ""}`;
}

export function certificateShareUrl(item: string): string {
  const i = cleanShared(item);
  return `${origin()}/c/${i ? `?i=${encodeURIComponent(i)}` : ""}`;
}

export type SharedLanding =
  | { kind: "verdict"; id: string; problem: string }
  | { kind: "certificate"; item: string };

/** What the current URL is asking us to show, if anything. */
export function readSharedLanding(): SharedLanding | null {
  if (typeof window === "undefined") return null;
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);

  const verdict = pathname.match(/^\/v\/([a-z0-9-]+)\/?$/);
  if (verdict) {
    return { kind: "verdict", id: verdict[1]!, problem: cleanShared(params.get("p") ?? "") };
  }
  if (/^\/c\/?$/.test(pathname)) {
    return { kind: "certificate", item: cleanShared(params.get("i") ?? "") };
  }
  return null;
}

/**
 * Hand the link to the OS share sheet, or the clipboard where there isn't one.
 * Resolves to true when it went to the clipboard, so the caller can say so.
 */
export async function shareLink(text: string, url: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ text, url });
      return false;
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return true;
  } catch {
    /* user bailed, or no clipboard; respect it either way */
    return false;
  }
}
