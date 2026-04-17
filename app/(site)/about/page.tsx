import type { Metadata } from "next";
import { Handshake, Shield, Wrench } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "About HVACR Group | Trusted Trade Services Since 1972",
  description:
    "Learn about HVACR Group — Queensland's most trusted refrigeration and air conditioning holding company. Three specialist brands united since 1972.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "1972", label: "Acro Refrigeration established" },
  { year: "1993", label: "Shelair founded" },
  { year: "2015", label: "Koolacube launched" },
  { year: "Today", label: "United under HVACR Group" },
];

const values = [
  { icon: Wrench, title: "Quality Workmanship", desc: "Every project is delivered to the highest standard of trade excellence, backed by our 5-year guarantee." },
  { icon: Shield, title: "Compliance Confidence", desc: "ISO-aligned systems, ARCtick and QBCC licensed — ensuring complete regulatory confidence." },
  { icon: Handshake, title: "Long-Term Relationships", desc: "We don't do one-off jobs. We build partnerships that last decades." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[360px] sm:min-h-[400px] md:h-[50vh] md:min-h-[420px] flex items-center overflow-hidden -mt-[72px] pt-[88px] pb-10 md:py-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about-hero.jpg"
          alt="Commercial HVAC rooftop installation"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="absolute inset-0 diagonal-texture" />
        <div className="container-main relative z-10">
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] leading-tight">
            Built on{" "}
            <span className="relative inline-block">
              Experience
              <span className="absolute bottom-0 left-0 w-full h-1 bg-accent" />
            </span>
            .<br />Focused on the Future.
          </h1>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-main">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 md:gap-4">
              {milestones.map((m, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1 sm:gap-2 md:flex-1 relative">
                  <span className="stat-number text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px]">{m.year}</span>
                  <span className="text-muted-foreground font-body text-xs sm:text-sm">{m.label}</span>
                  {i < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-full h-px border-t border-dashed border-accent/40 -z-10 translate-x-1/2" />
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-surface-alt">
        <div className="container-main">
          <AnimatedSection className="max-w-[800px] mx-auto text-center">
            <blockquote className="font-display font-bold text-navy text-lg sm:text-xl md:text-2xl lg:text-[28px] leading-relaxed">
              &ldquo;Our growth strategy is simple — acquire, strengthen, and grow specialist trade service businesses while maintaining the values that built them.&rdquo;
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-navy diagonal-texture">
        <div className="container-main">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <h2 className="font-display font-bold text-primary-foreground text-2xl sm:text-[28px] md:text-[36px] lg:text-[44px]">Our Values</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="card-elevated text-center">
                  <v.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-display font-bold text-charcoal text-lg mb-2">{v.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 bg-card">
        <div className="container-main">
          <AnimatedSection className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-8 md:gap-16 text-muted-foreground font-body text-xs sm:text-sm font-medium text-center">
            <span>ARCtick Licensed</span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span>QBCC Certified</span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span>NSW Contractor</span>
            <span className="hidden sm:inline-block h-4 w-px bg-border" />
            <span>Veteran-Owned</span>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
