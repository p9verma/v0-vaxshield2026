"use client"

import { useState } from "react"
import { ChevronDown, Mail } from "lucide-react"

const faqs = [
  {
    question: "Are vaccines safe?",
    answer:
      "Yes. Vaccines are among the most rigorously tested medical interventions. Before approval, they go through multiple phases of clinical trials involving tens of thousands of participants. The CDC, FDA, and WHO continuously monitor vaccine safety after approval through surveillance systems like VAERS. Serious side effects are rare and far less common than the risks posed by the diseases vaccines prevent.",
  },
  {
    question: "Do vaccines cause autism?",
    answer:
      "No. This claim originated from a 1998 study that has since been fully retracted due to fraud and ethical violations. Decades of research involving millions of children across dozens of countries have found no link between vaccines and autism. Major health organizations worldwide, including the CDC, WHO, and AAP, confirm this conclusion.",
  },
  {
    question: "Can I get the disease from the vaccine?",
    answer:
      "No. Most vaccines use inactivated (killed) viruses, protein subunits, or mRNA, none of which can cause infection. Some vaccines use a weakened live virus, but the virus is too weakened to cause disease in healthy individuals. You may experience mild symptoms like soreness or low fever, which are signs your immune system is building protection, not signs of infection.",
  },
  {
    question: "Why do we need multiple doses or annual boosters?",
    answer:
      "Different vaccines require different schedules based on how your immune system responds. Some vaccines need multiple doses to build a strong initial immune response. Others, like flu vaccines, need annual updates because the virus mutates. Boosters refresh immunity that may have faded over time. Following the recommended schedule ensures full protection.",
  },
  {
    question: "What are common vaccine side effects?",
    answer:
      "Common side effects include soreness at the injection site, mild fever, fatigue, and headache. These typically resolve within 1–2 days and are signs that your immune system is responding. Serious allergic reactions (anaphylaxis) are very rare, roughly 1–2 per million doses, and vaccination sites are equipped to respond if they occur.",
  },
  {
    question: "Can minors get vaccinated without parental consent?",
    answer:
      "This varies by state and vaccine type. In Michigan, minors may consent to certain vaccines (particularly those related to sexual health or communicable diseases) without a parent's permission. For routine childhood vaccines, parental consent is generally required. Some clinics and school programs offer vaccination with parental consent on file. If you are a minor with questions about your specific situation, speak with a healthcare provider or call the Michigan DHHS Immunization line at 1-888-535-6136.",
  },
  {
    question: "What if I have allergies or a weakened immune system?",
    answer:
      "Most people with allergies can still be vaccinated safely. Let your provider know about any past allergic reactions, especially to vaccines or their ingredients. People with weakened immune systems may need to avoid certain live-virus vaccines, but can usually receive inactivated or mRNA vaccines. Always consult your healthcare provider to determine the right schedule for your health situation.",
  },
  {
    question: "Why should I get vaccinated if others around me are?",
    answer:
      "Herd immunity only works when enough people are vaccinated. When vaccination rates drop, even slightly, diseases that were nearly eliminated can return. Some people (infants, immunocompromised individuals, those with medical exemptions) cannot be vaccinated and depend on the community around them for protection. Getting vaccinated protects not just yourself, but those who can't protect themselves.",
  },
  {
    question: "Where can I get vaccinated for free?",
    answer:
      "Many clinics, pharmacies, and health departments offer free vaccines through programs like the Vaccines for Children (VFC) program, Medicaid, and community health grants. Use our VaxSearch tool to find free vaccine providers near you, or call the CDC Vaccine Hotline at 1-800-232-4636.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Common Concerns</p>
          <h2 className="text-3xl font-bold text-slate-900 text-balance mb-3">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Honest answers to the questions we hear most often about vaccine safety, effectiveness, and access.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-sky-50 transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-slate-900 text-sm leading-snug">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-sky-600 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed bg-sky-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Still have a question? Reach out directly.</p>
          <a
            href="mailto:vaxshieldteam@gmail.com"
            className="inline-flex items-center gap-2 text-sky-600 hover:underline font-medium text-sm"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            vaxshieldteam@gmail.com
          </a>
        </div>
      </div>
    </section>
  )
}
