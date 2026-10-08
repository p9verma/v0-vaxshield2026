import { Newspaper, ArrowUpRight } from "lucide-react"
import { pressMentions } from "@/lib/press"

export function PressSection() {
  if (pressMentions.length === 0) return null

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sky-600 text-sm font-semibold uppercase tracking-widest mb-2">In the News</p>
          <h2 className="text-3xl font-bold text-slate-900 text-balance">Recognized beyond our own classroom</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {pressMentions.map(({ outlet, description, url, date, badge }) => (
            <a
              key={outlet}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full sm:w-[26rem] flex-col overflow-hidden rounded-2xl border border-sky-600/15 bg-gradient-to-br from-sky-50 via-white to-white p-7 transition-all hover:-translate-y-1 hover:border-sky-600/40 hover:shadow-xl hover:shadow-sky-600/10"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-600/10 blur-2xl transition-opacity group-hover:opacity-80"
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-sm transition-transform group-hover:scale-105">
                  <Newspaper className="h-5 w-5 text-sky-400" aria-hidden="true" />
                </div>
                {badge && (
                  <span className="rounded-full bg-sky-600/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-600">
                    {badge}
                  </span>
                )}
              </div>

              <h3 className="relative text-lg font-bold text-slate-900 mb-2">{outlet}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>

              <div className="relative mt-auto flex items-center justify-between border-t border-slate-900/5 pt-4">
                <span className="text-xs font-medium text-muted-foreground">{date}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition-all group-hover:gap-1.5">
                  Read the feature
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
