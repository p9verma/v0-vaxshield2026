import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { ImpactCounter } from "@/components/home/impact-counter"
import { SimulatorSection } from "@/components/home/simulator-section"
import { ProblemSection } from "@/components/home/problem-section"
import { AudienceSection } from "@/components/home/audience-section"
import { ProductsSection } from "@/components/home/products-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { PartnersSection } from "@/components/home/partners-section"
import { FaqSection } from "@/components/home/faq-section"
import { FeedbackSection } from "@/components/home/feedback-section"
import { DonateSection } from "@/components/home/donate-section"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

// Tells Google what kind of entity VaxShield is -- this is what can earn a
// knowledge panel and sitelinks for brand-name searches ("VaxShield"), not
// just a ranked result among other pages.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SITE_DESCRIPTION,
  sameAs: ["https://linkedin.com/in/vaxshield-inc-5811143bb"],
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <ImpactCounter />
        <SimulatorSection />
        <ProblemSection />
        <AudienceSection />
        <ProductsSection />
        <TestimonialsSection />
        <PartnersSection />
        <FaqSection />
        <FeedbackSection />
        <DonateSection />
      </main>
      <Footer />
    </div>
  )
}
