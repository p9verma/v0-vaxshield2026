/**
 * Single source of truth for VaxShield's partner list.
 *
 * Previously this lived as three independent hardcoded arrays (the homepage
 * strip, the about page, and the impact page), which had already drifted:
 * "Jackson Public Schools" vs "Jackson Public School System", "UM Optimize" vs
 * "UM Optimize Program", and Ypsilanti Community Health Center appearing on
 * only one of the three. Update names here and every page follows.
 */

export type PartnerCategory = "academic" | "clinical" | "school"

export interface Partner {
  name: string
  /** Shown on the about page. */
  role: string
  category: PartnerCategory
  /** Homepage "Trusted By" strip shows only these, to keep the row short. */
  featured?: boolean
}

export const partners: Partner[] = [
  {
    name: "University of Michigan",
    role: "Academic home and Optimize program support",
    category: "academic",
    featured: true,
  },
  {
    name: "UM School of Public Health",
    role: "Advisors, research collaboration, and expert review",
    category: "academic",
    featured: true,
  },
  {
    name: "Michigan Medicine",
    role: "Clinician advisors and public health expertise",
    category: "academic",
    featured: true,
  },
  {
    name: "Ross Business School",
    role: "Strategy and organizational development support",
    category: "academic",
    featured: true,
  },
  {
    name: "UM Optimize Program",
    role: "Startup and nonprofit development support",
    category: "academic",
    featured: true,
  },
  {
    name: "Cass Clinic, Detroit",
    role: "Pilot site and community healthcare partner",
    category: "clinical",
    featured: true,
  },
  {
    name: "Ypsilanti Community Health Center",
    role: "Community clinic partner",
    category: "clinical",
  },
  {
    name: "Huron High School, Ann Arbor",
    role: "Curriculum testing and educator feedback",
    category: "school",
    featured: true,
  },
  {
    name: "Jackson Public School System",
    role: "Classroom pilot and student engagement partner",
    category: "school",
    featured: true,
  },
]

export const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  academic: "Academic Partners",
  clinical: "Clinical Partners",
  school: "School Partners",
}

export const CATEGORY_ORDER: PartnerCategory[] = ["academic", "clinical", "school"]

/** Aspirational, not current partners. Kept separate so it can never be
 *  mistaken for a real affiliation. */
export const futureCollaboration = [
  "Additional school districts",
  "Regional hospitals and clinic networks",
  "Public health nonprofits",
  "Corporate health sponsors",
]

export const featuredPartners = partners.filter((p) => p.featured)

export function partnersByCategory(category: PartnerCategory): Partner[] {
  return partners.filter((p) => p.category === category)
}
