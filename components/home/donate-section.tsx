import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, BookOpen, Users } from "lucide-react"

export function DonateSection() {
  return (
    <section id="donate" className="py-16 bg-sky-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-14 h-14 rounded-full bg-sky-400/15 flex items-center justify-center mx-auto mb-6">
          <Heart className="h-7 w-7 text-sky-500" aria-hidden="true" />
        </div>
        <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">Support VaxShield</p>
        <h2 className="text-3xl font-bold text-blue-950 text-balance mb-4">
          Your donation funds education, not advertising.
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
          Every contribution directly supports curriculum development, free resource access for underserved schools, and community outreach programs. VaxShield is transparent about where every dollar goes.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Funds lesson plans for a classroom", amount: "$25" },
            { icon: Users, label: "Sponsors a community clinic kit", amount: "$100" },
            { icon: Heart, label: "Supports a full school pilot", amount: "$500" },
          ].map(({ icon: Icon, label, amount }) => (
            <div key={amount} className="bg-white rounded-xl p-4 border border-sky-200 text-left shadow-sm">
              <Icon className="h-5 w-5 text-sky-500 mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-blue-950">{amount}</p>
              <p className="text-sm text-slate-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-sky-500 text-white hover:bg-sky-600 gap-2 font-semibold">
            <Link href="/contact?type=donate">
              <Heart className="h-4 w-4" aria-hidden="true" />
              Donate Now
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white">
            <Link href="/impact">See Where Funds Go</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
