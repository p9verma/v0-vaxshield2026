import { Newspaper, ExternalLink } from "lucide-react"
import { pressMentions } from "@/lib/press"

export function PressSection() {
  if (pressMentions.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[--sky] text-sm font-semibold uppercase tracking-widest mb-2">Featured In</p>
          <h2 className="text-3xl font-bold text-[--navy] text-balance">As seen in</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {pressMentions.map(({ outlet, description, url, date }) => (
            <a
              key={outlet}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col w-full sm:w-80 bg-[--sky-pale] rounded-2xl p-6 border border-[--sky]/20 hover:border-[--sky]/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[--sky]/15 flex items-center justify-center">
                  <Newspaper className="h-5 w-5 text-[--sky]" aria-hidden="true" />
                </div>
                <ExternalLink
                  className="h-4 w-4 text-muted-foreground group-hover:text-[--sky] transition-colors"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-[--navy] mb-1">{outlet}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
              <p className="text-xs text-[--sky] font-medium mt-auto">{date}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
