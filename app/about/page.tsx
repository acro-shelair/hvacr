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
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden -mt-[72px] pt-[72px]">
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
          <h1 className="font-display font-extrabold text-primary-foreground text-[36px] md:text-[56px] lg:text-[72px] leading-tight">
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
              {milestones.map((m, i) => (
                <div key={i} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 flex-1 relative">
                  <span className="stat-number text-[40px] md:text-[72px]">{m.year}</span>
                  <span className="text-muted-foreground font-body text-sm md:text-center">{m.label}</span>
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
            <blockquote className="font-display font-bold text-navy text-xl md:text-[28px] leading-relaxed">
              &ldquo;Our growth strategy is simple — acquire, strengthen, and grow specialist trade service businesses while maintaining the values that built them.&rdquo;
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-navy diagonal-texture">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display font-bold text-primary-foreground text-[28px] md:text-[44px]">Our Values</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
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

      <section className="py-12 bg-card">
        <div className="container-main">
          <AnimatedSection className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-muted-foreground font-body text-sm font-medium">
            <span>ARCtick Licensed</span>
            <span className="h-4 w-px bg-border" />
            <span>QBCC Certified</span>
            <span className="h-4 w-px bg-border" />
            <span>NSW Contractor</span>
            <span className="h-4 w-px bg-border" />
            <span>Veteran-Owned</span>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
