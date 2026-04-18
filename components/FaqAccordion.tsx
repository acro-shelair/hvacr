"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openId === faq.id;
        return (
          <AnimatedSection key={faq.id} delay={i * 0.05}>
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-card hover:bg-surface-alt transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-display font-semibold text-charcoal text-[15px] leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 pt-1 text-muted-foreground font-body text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </AnimatedSection>
        );
      })}
    </div>
  );
}
