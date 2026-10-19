"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const vaccineFacts = [
  {
    title: "Vaccines can Prevent Certain Types of Cancers",
    description:
      "Some cancers are caused by viruses! The HPV vaccine helps prevent infections that can lead to cervical, throat, anal, and other cancers, while the hepatitis B vaccine helps prevent liver cancer. Vaccines aren't just about preventing infections—they can also protect people from developing cancer decades later.",
    sources: [
      {
        title: "Reasons to get Vaccinated | HPV Vaccine",
        url: "https://www.cdc.gov/hpv/vaccines/reasons-to-get.html",
      },
      {
        title: "Preventing Cancer: The Far-Reaching Impact of Vaccines",
        url: "https://publichealth.jhu.edu/ivac/2025/preventing-cancer-the-far-reaching-impact-of-vaccines",
      },
      {
        title: "CDC: Hepatitis B Basics",
        url: "https://www.cdc.gov/hepatitis-b/about/index.html"
      {
    ],
  },
  {
    title: "Immunizations Currently Prevent Millions of Deaths Each Year",
    description:
      "According to the World Health Organization (WHO), immunizations prevent approximately 3.5–5 million deaths each year from diseases such as measles, tetanus, influenza, and whooping cough. That's millions of people who get to live longer, healthier lives because of vaccines.",
    sources: [
      {
        title: "CDC: Vaccines and Immunizations",
        url: "https://www.who.int/health-topics/vaccines-and-immunization#tab=tab_1",
      },
    ],
  },
  {
    title: "One Vaccine Helped Eradicate an Entire Human Disease",
    description:
      "Smallpox once killed millions of people and left many survivors with permanent scars. Thanks to a worldwide vaccination campaign, smallpox became the first human disease to be completely eradicated in 1980. Today, routine smallpox vaccination is no longer necessary for the general public.",
    sources: [
      {
        title: "World Health Organization: Smallpox",
        url: "https://www.who.int/health-topics/smallpox#tab=tab_1",
      },
    ],
  },
  {
    title: "Your Immune System Has a Memory",
    description:
      "Just like your brain remembers information for a test, your immune system can remember germs it has encountered! Vaccines train your immune system to recognize specific pathogens, allowing it to respond faster and more effectively if you encounter them in the future.",
    sources: [
      {
        title: "World Health Organization: How do Vaccines Work",
        url: "https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work",
      },
    ],
  },
  {
    title: "Measles Can Linger in the Air for Up to Two Hours",
    description:
      "Measles is so contagious that its virus can remain infectious in the air for up to two hours after an infected person leaves a room. 9 out of 10 unvaccinated individuals who have close contact with an infected person may become infected.",
    sources: [
      {
        title: "CDC: Clinical Overview of Measles",
        url: "https://www.cdc.gov/measles/hcp/clinical-overview/index.html",
      },
    ],
  },
  {
    title: "Scientists Can Track Disease Outbreaks by Testing Sewage",
    description:
      "Believe it or not, wastewater can reveal clues about diseases spreading through a community! Scientists test sewage for traces of viruses, sometimes detecting increases in infections before people visit a doctor. This helps public health officials identify potential outbreaks earlier.",
    sources: [
      {
        title: "CDC: About Washwater Data",
        url: "https://www.cdc.gov/wastewater/about-data/index.html",
      },
    ],
  },
  {
    title: "The World's Deadliest Animal Is the Mosquito",
    description:
      "Forget sharks, lions, and bears! Mosquitoes cause more human deaths than any other animal because they spread diseases such as malaria, dengue, and yellow fever. Public health measures such as mosquito control, insecticide-treated bed nets, and vaccination against certain mosquito-borne diseases can help protect communities.",
    sources: [
      {
        title: "CDC: Fighting the World's Deadliest Animals",
        url: "https://www.cdc.gov/global-health/impact/fighting-the-worlds-deadliest-animal.html",
      },
    ],
  },
  {
    title: "Vaccines Have Saved an Estimated 154 Million Lives in Just 50 Years",
    description:
      "A major study published in The Lancet estimated that global vaccination efforts prevented approximately 154 million deaths between 1974 and 2024. That's equivalent to saving about six lives every minute for 50 years!",
    sources: [
      {
        title: "Global immunization efforts have saved at least 154 million lives over the past 50 years",
        url: "https://www.who.int/news/item/24-04-2024-global-immunization-efforts-have-saved-at-least-154-million-lives-over-the-past-50-years",
      },
    ],
  },
  {
    title: "Vaccines Have Helped More Than 20 Million People Avoid Paralysis",
    description:
      "Polio is a disease that can damage the nervous system and cause permanent paralysis. According to WHO estimates, polio vaccination has allowed more than 20 million people to walk who otherwise would have experienced paralysis.",
    sources: [
      {
        title: "World Health Organization: Global immunization efforts have saved at least 154 million lives over the past 50 years",
        url: "https://www.who.int/news/item/24-04-2024-global-immunization-efforts-have-saved-at-least-154-million-lives-over-the-past-50-years",
      },
    ],
  },
]

const factCardColors = ["#98bad5", "#b2cbde", "#adcbe3"]

export function VaccineFactsSlideshow() {
  const [firstFactIndex, setFirstFactIndex] = useState(0)
  const secondFactIndex = (firstFactIndex + 1) % vaccineFacts.length

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFirstFactIndex((currentIndex) => (currentIndex + 1) % vaccineFacts.length)
    }, 15_000)

    return () => window.clearTimeout(timeout)
  }, [firstFactIndex])

  const visibleFactIndexes = [firstFactIndex, secondFactIndex]

  return (
    <section
      aria-labelledby="vaccine-facts-heading"
      aria-roledescription="carousel"
      className="mb-6 w-full"
      role="region"
    >
      <div className="rounded-2xl border border-[#c6d3e3]/20 border-t-4 border-t-[#FFCB05] bg-[#00274C] p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 inline-flex rounded-full bg-[#FFCB05] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#00274C]">
              Did you know?
            </p>
            <h2 id="vaccine-facts-heading" className="text-2xl font-bold text-[#c6d3e3]">
              Vaccine Fun Facts
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-sm text-[#c6d3e3]" aria-live="off">
              Facts {firstFactIndex + 1} and {secondFactIndex + 1} of {vaccineFacts.length}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-[#c6d3e3]/50 text-[#c6d3e3] hover:border-[#FFCB05] hover:bg-[#FFCB05] hover:text-[#00274C]"
              aria-label="Show previous vaccine facts"
              onClick={() => {
                setFirstFactIndex(
                  (currentIndex) => (currentIndex - 1 + vaccineFacts.length) % vaccineFacts.length,
                )
              }}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-[#c6d3e3]/50 text-[#c6d3e3] hover:border-[#FFCB05] hover:bg-[#FFCB05] hover:text-[#00274C]"
              aria-label="Show next vaccine facts"
              onClick={() => {
                setFirstFactIndex((currentIndex) => (currentIndex + 1) % vaccineFacts.length)
              }}
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2" aria-live="off">
          {visibleFactIndexes.map((factIndex) => {
            const fact = vaccineFacts[factIndex]

            return (
              <article
                key={fact.title}
                aria-label={`Fact ${factIndex + 1} of ${vaccineFacts.length}`}
                aria-roledescription="slide"
                className="flex flex-col rounded-xl border border-[#00274C]/15 p-4 sm:p-5"
                style={{ backgroundColor: factCardColors[factIndex % factCardColors.length] }}
                role="group"
              >
                <h3 className="mb-2 text-lg font-bold leading-snug text-[#00274C]">{fact.title}</h3>
                <p className="mb-3 flex-1 text-sm leading-relaxed text-[#00274C]">
                  {fact.description}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#00274C]">
                    Sources:
                  </h4>
                  <ul className="inline-flex flex-wrap gap-x-3 gap-y-1">
                    {fact.sources.map((source) => (
                      <li key={source.url}>
                        <a
                          className="text-sm font-semibold text-[#00274C] underline underline-offset-2 hover:text-[#304674] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00274C]"
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.title}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
