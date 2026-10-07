/**
 * Single source of truth for press/media mentions ("Featured In" section).
 * Add a new entry here and it shows up on the homepage automatically.
 */

export interface PressMention {
  outlet: string
  description: string
  url: string
  date: string
}

export const pressMentions: PressMention[] = [
  {
    outlet: "Michigan Department of Education",
    description:
      "Featured in the MDE Science Newsletter as an interactive infectious disease simulation tool for grades 9–12.",
    url: "https://content.govdelivery.com/accounts/MIMDE/bulletins/41f9859",
    date: "October 2026",
  },
]
