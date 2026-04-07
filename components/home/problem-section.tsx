import { AlertTriangle, Brain, BookX, TrendingDown } from "lucide-react"

const problems = [
  {
    icon: TrendingDown,
    title: "Declining Vaccination Rates",
    body: "Many communities have seen vaccination rates slip below herd immunity thresholds, putting vulnerable populations at risk.",
  },
  {
    icon: Brain,
    title: "Cognitive Bias & Hesitancy",
    body: "Misinformation exploits natural cognitive biases, making fear-based narratives feel more compelling than scientific evidence.",
  },
  {
    icon: BookX,
    title: "Lack of Accessible Resources",
    body: "Schools and clinics often lack age-appropriate, culturally sensitive materials that engage students and families in honest conversations.",
  },
  {
    icon: AlertTriangle,
    title: "Post-COVID Misinformation",
    body: "The pandemic dramatically accelerated the spread of vaccine misinformation, leaving lasting doubt that requires evidence-based, empathetic education to address.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-16 bg-blue-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sky-500 text-sm font-semibold uppercase tracking-widest mb-2">The Challenge</p>
          <h2 className="text-3xl font-bold text-balance mb-4 text-white">
            Misinformation is spreading. Education is the antidote.
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
            VaxShield exists because the problem is real — and because communities deserve better than fear, silence, or outdated materials. Our approach is rooted in science, built on empathy, and designed to empower.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-sky-500" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
