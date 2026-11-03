import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQS } from '../lib/faqs';

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <span className="ornament inline-block text-xs uppercase tracking-[0.35em] text-gold-300/70">The Codex</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">
            Questions, Answered
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gold-100/50">
            Everything you need to know about scan reliability, HD downloads, and how Aurea works.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen
                    ? 'border-gold-400/30 bg-ink-800/60'
                    : 'border-gold-400/12 bg-ink-900/50'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-display text-lg font-medium text-gold-50">{faq.q}</span>
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition ${
                      isOpen
                        ? 'border-gold-400/50 bg-gold-400/10 text-gold-300'
                        : 'border-gold-400/20 text-gold-200/50'
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-gold-100/55">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqAccordion;
