/**
 * Site-wide constants for metadata, Open Graph, sitemap, and JSON-LD.
 *
 * SITE_URL is vaxhield.org, the domain registered to this Vercel project.
 * Absolute URLs built from it (canonical links, sitemap, OG `url`) are only
 * actually correct once that domain's DNS is pointed at Vercel -- see the
 * domain configuration warning in `vercel domains inspect vaxhield.org`.
 * Until then they describe the intended production domain, not the one
 * currently serving traffic.
 */
export const SITE_URL = "https://vaxhield.org"
export const SITE_NAME = "VaxShield"
export const SITE_DESCRIPTION =
  "VaxShield reduces vaccine misinformation through science-backed lesson plans, an interactive herd immunity simulator, and a nationwide vaccine provider search."
