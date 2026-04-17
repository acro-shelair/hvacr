import type { Metadata } from "next";
import { Award, Mail, TrendingUp, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Careers at HVACR Group | HVAC Jobs in QLD & NSW",
  description:
    "Join HVACR Group — one of Queensland's leading refrigeration and air conditioning employers. Explore career opportunities across Acro Refrigeration, Shelair and Koolacube.",
  alternates: { canonical: "/careers" },
};

const reasons = [
  { icon: Users, title: "Family Culture", desc: "We're a tight-knit group that values respect, collaboration and looking after our people." },
  { icon: TrendingUp, title: "Career Growth", desc: "Structured pathways for apprentices, tradespeople and managers across three specialist brands." },
  { icon: Award, title: "Industry Leaders", desc: "Work with the best equipment, systems and clients in the refrigeration and HVAC sector." },
];

export default function CareersPage() {
  return (
    <>
      <section className="bg-navy diagonal-texture -mt-[72px] pt-[104px] sm:pt-[128px] md:pt-[172px] pb-14 sm:pb-16 md:pb-20 lg:pb-[100px]">
        <div className="container-main">
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-4">
            Join the HVACR Group Family
          </h1>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-[550px]">
            Build your career with one of Queensland&apos;s most respected trade services groups.
          </p>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-main">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <h2 className="section-heading mb-4">Why Work With Us</h2>
            <p className="text-muted-foreground font-body text-base sm:text-lg max-w-[550px] mx-auto">
              We invest in our people because they&apos;re the foundation of everything we do.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reasons.map((r, i) => (
              <AnimatedSection key={r.title} delay={i * 0.1}>
                <div className="brand-card text-center h-full">
                  <r.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-display font-bold text-charcoal text-lg mb-2">{r.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{r.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-alt">
        <div className="container-main">
          <AnimatedSection>
            <div className="bg-accent rounded-2xl p-6 sm:p-10 md:p-16 text-center">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-accent-foreground mx-auto mb-4" />
              <h2 className="font-display font-bold text-accent-foreground text-2xl sm:text-[28px] md:text-[36px] mb-4">
                Ready to Apply?
              </h2>
              <p className="text-accent-foreground/90 font-body text-base sm:text-lg mb-6 max-w-[450px] mx-auto">
                Send your resume and a cover letter to our recruitment team.
              </p>
              <a
                href="mailto:careers@hvacrgroup.com.au"
                className="inline-flex items-center justify-center bg-navy text-primary-foreground font-body font-medium px-5 sm:px-8 h-12 sm:h-[52px] rounded-lg transition-transform duration-200 hover:scale-[1.03] text-sm sm:text-[15px] gap-2 w-full sm:w-auto break-all sm:break-normal"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">careers@hvacrgroup.com.au</span>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
