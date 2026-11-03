import { Crown, ArrowRight } from 'lucide-react';
import { TEMPLATES, type QrTemplate } from '../lib/templates';

type Props = {
  onApply: (template: QrTemplate) => void;
};

function Templates({ onApply }: Props) {
  return (
    <section id="templates" className="relative z-10 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="ornament inline-block text-xs uppercase tracking-[0.35em] text-gold-300/70">The Gallery</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">
            Pre-Crafted Royal Templates
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gold-100/50">
            Hand-composed palettes with matching crests. Apply one instantly and customize from there.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-2xl border border-gold-400/12 bg-ink-900/60 transition hover:border-gold-400/35 hover:bg-ink-800/60 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-400/5 blur-2xl transition group-hover:bg-gold-400/12" />
              {/* Preview swatch */}
              <div
                className="relative flex h-44 items-center justify-center overflow-hidden"
                style={{ background: t.light }}
              >
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-xl"
                  style={{ background: t.dark }}
                >
                  {t.logo ? (
                    <img src={t.logo} alt={t.name} className="h-20 w-20 object-contain" />
                  ) : (
                    <Crown className="h-12 w-12" style={{ color: t.light }} />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-3">
                  {[t.dark, t.light, '#d4a73c'].map((c, idx) => (
                    <span
                      key={idx}
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="relative p-5">
                <h3 className="font-display text-xl font-semibold text-gold-50">{t.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gold-100/45">{t.description}</p>
                <button
                  onClick={() => onApply(t)}
                  className="btn-ghost-gold mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition group-hover:gap-3"
                >
                  Apply Template <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Templates;
