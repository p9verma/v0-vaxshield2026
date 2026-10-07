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
import { PressSection } from "@/components/home/press-section"
import { FaqSection } from "@/components/home/faq-section"
import { FeedbackSection } from "@/components/home/feedback-section"
import { DonateSection } from "@/components/home/donate-section"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
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
        <PressSection />
        <FaqSection />
        <FeedbackSection />
        <DonateSection />
      </main>
      <Footer />
    </div>
  )
}
