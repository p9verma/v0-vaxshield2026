/**
 * Site-wide constants for metadata, Open Graph, sitemap, and JSON-LD.
 *
 * SITE_URL is vaxshield.org, registered 2026-10-08 via Cloudflare Registrar
 * and added to this Vercel project. Absolute URLs built from it (canonical
 * links, sitemap, OG `url`) are only actually correct once its DNS record
 * is added in Cloudflare -- see `vercel domains inspect vaxshield.org` for
 * the exact record needed. Until then they describe the intended production
 * domain, not the one currently serving traffic.
 */
export const SITE_URL = "https://vaxshield.org"
export const SITE_NAME = "VaxShield"
export const SITE_DESCRIPTION =
  "VaxShield reduces vaccine misinformation through science-backed lesson plans, an interactive herd immunity simulator, and a nationwide vaccine provider search."
