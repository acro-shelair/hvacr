import type { Metadata } from "next";
import Link from "next/link";
import {
  Building,
  CheckCircle,
  Factory,
  GraduationCap,
  HeartPulse,
  Phone,
  Snowflake,
  Tent,
  UtensilsCrossed,
  Wind,
  Box,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import FaqAccordion from "@/components/FaqAccordion";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "HVACR Group | Refrigeration & Air Conditioning Experts | Brisbane QLD",
  description:
    "Queensland's most trusted refrigeration and climate control group. Three specialist brands — Acro Refrigeration, Shelair & Koolacube — serving commercial and industrial clients since 1972.",
  alternates: { canonical: "/" },
};

const stats = [
  { value: "50+", label: "Years Experience" },
  { value: "3", label: "Specialist Brands" },
  { value: "1000s", label: "Projects Completed" },
  { value: "5-Year", label: "Workmanship Guarantee" },
];

const brands = [
  {
    name: "Acro Refrigeration",
    specialty: "Commercial & industrial refrigeration specialists since 1972.",
    services: [
      "Cold room installation & repair",
      "Refrigerated transport systems",
      "Preventative maintenance programs",
    ],
    icon: Snowflake,
  },
  {
    name: "Shelair",
    specialty:
      "Air conditioning design, installation and servicing for commercial environments.",
    services: [
      "VRV/VRF system design & install",
      "Ducted & split system solutions",
      "BMS integration & controls",
    ],
    icon: Wind,
  },
  {
    name: "Koolacube",
    specialty: "Relocatable cold rooms and portable refrigeration solutions.",
    services: [
      "Modular cold & freezer rooms",
      "Event & emergency cold storage",
      "Rapid deployment solutions",
    ],
    icon: Box,
  },
];

const industries = [
  { icon: HeartPulse, label: "Healthcare & Hospitals" },
  { icon: UtensilsCrossed, label: "Hospitality & Food Service" },
  { icon: GraduationCap, label: "Education & Schools" },
  { icon: Building, label: "Commercial & Retail" },
  { icon: Factory, label: "Industrial & Warehousing" },
  { icon: Tent, label: "Events & Temporary Storage" },
];

const features = [
  {
    title: "Trusted Since 1972",
    desc: "Over five decades of trade excellence in Queensland.",
  },
  {
    title: "5-Year Workmanship Guarantee",
    desc: "Industry-leading warranty on all installations.",
  },
  {
    title: "ISO-Aligned Compliance",
    desc: "Rigorous quality and safety management systems.",
  },
  {
    title: "End-to-End Service",
    desc: "From design and install to ongoing maintenance.",
  },
  {
    title: "Australian Owned & Operated",
    desc: "Proudly local, serving QLD and NSW.",
  },
  {
    title: "Veteran-Owned Business",
    desc: "Built on discipline, integrity and service.",
  },
];

function HeroWordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-reveal inline-block mr-[0.3em]"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HVACR Group",
  url: "https://hvacrgroup.com.au",
  logo: "https://hvacrgroup.com.au/logo.png",
  telephone: "1300227600",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kelvin Grove",
    addressRegion: "QLD",
    postalCode: "4059",
    addressCountry: "AU",
  },
  description:
    "Queensland's most trusted refrigeration and air conditioning group.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, answer")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative flex flex-col min-h-[calc(100svh-72px)] lg:min-h-screen overflow-hidden -mt-18 pt-18">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-industrial.jpg"
          alt="Industrial cold storage refrigeration facility"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="absolute inset-0 diagonal-texture" />

        <div className="container-main relative z-10 flex-1 flex items-center py-12 sm:py-16 lg:py-20 lg:pb-44">
          <div className="w-full">
            <p className="hero-eyebrow mb-4 sm:mb-6">
              Trusted Trade Services Since 1972
            </p>
            <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] lg:text-18 leading-[1.1] max-w-200 mb-4 sm:mb-6">
              <HeroWordReveal text="Queensland's Most Trusted Refrigeration & Climate Control Group" />
            </h1>
            <p className="text-primary-foreground/80 font-body text-base sm:text-lg md:text-xl max-w-150 mb-8 sm:mb-10 leading-relaxed">
              Three specialist brands. One group. Serving commercial,
              industrial, healthcare and hospitality clients across QLD and NSW.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link href="/brands" className="btn-primary w-full sm:w-auto">
                Explore Our Brands
              </Link>
              <Link
                href="/about"
                className="btn-outline-white w-full sm:w-auto"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
          <div className="container-main">
            <div className="bg-card rounded-t-xl grid grid-cols-2 lg:grid-cols-4 shadow-(--shadow-card)">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`p-4 sm:p-6 md:p-8 text-center border-border ${
                    i < 2 ? "border-b lg:border-b-0" : ""
                  } ${i % 2 === 0 ? "border-r lg:border-r" : ""} ${
                    i === stats.length - 1 ? "lg:border-r-0" : ""
                  }`}
                >
                  <span className="stat-number text-xl sm:text-2xl md:text-4xl block mb-1">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground font-body text-xs sm:text-sm">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="section-padding bg-surface-alt">
        <div className="container-main">
          <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="section-heading mb-4">
              Three Brands. One Standard of Excellence.
            </h2>
            <p className="text-muted-foreground font-body text-base sm:text-lg max-w-162.5 mx-auto">
              Each brand is a specialist — united by HVACR Group&apos;s
              commitment to quality, compliance, and client relationships.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {brands.map((brand, i) => (
              <AnimatedSection key={brand.name} delay={i * 0.1}>
                <div className="brand-card h-full flex flex-col">
                  <brand.icon className="w-10 h-10 text-accent mb-4" />
                  <h3 className="font-display font-bold text-xl text-charcoal mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-muted-foreground font-body text-[15px] mb-4">
                    {brand.specialty}
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {brand.services.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm font-body text-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/brands"
                    className="btn-outline-navy text-sm h-10 px-4 self-start"
                  >
                    Visit {brand.name.split(" ")[0]} →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section-padding bg-navy diagonal-texture">
        <div className="container-main">
          <AnimatedSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="font-display font-bold text-primary-foreground text-2xl sm:text-[28px] md:text-[36px] lg:text-[44px] mb-4">
              Industries We Serve
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.label} delay={i * 0.05}>
                <div className="border border-primary-foreground/20 rounded-xl p-4 sm:p-6 md:p-8 text-center h-full flex flex-col items-center justify-center transition-all duration-200 hover:bg-accent hover:border-accent group cursor-default">
                  <ind.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground/80 mx-auto mb-2 sm:mb-3 group-hover:text-accent-foreground transition-colors" />
                  <span className="text-primary-foreground font-body font-medium text-xs sm:text-sm md:text-base group-hover:text-accent-foreground transition-colors">
                    {ind.label}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY HVACR */}
      <section className="section-padding bg-surface">
        <div className="container-main">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
            <AnimatedSection className="lg:col-span-5">
              <h2 className="font-display font-bold text-charcoal text-[28px] sm:text-[32px] md:text-[44px] lg:text-[52px] leading-tight">
                Why Choose
                <br />
                HVACR Group?
              </h2>
              <div className="w-16 h-1 bg-accent mt-4 sm:mt-6" />
            </AnimatedSection>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5 sm:gap-6">
              {features.map((feat, i) => (
                <AnimatedSection key={feat.title} delay={i * 0.06}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-1 shrink-0" />
                    <div>
                      <h3 className="font-display font-bold text-charcoal text-base mb-1">
                        {feat.title}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQS */}
      {faqs && faqs.length > 0 && (
        <section className="section-padding bg-surface-alt">
          <div className="container-main">
            <AnimatedSection className="text-center mb-10 sm:mb-12">
              <h2 className="section-heading mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground font-body text-base sm:text-lg max-w-150 mx-auto">
                Common questions about our services, brands, and how we work.
              </p>
            </AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <FaqAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="relative bg-navy diagonal-texture overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-accent/20 -translate-x-1/2 -translate-y-1/2 rotate-45" />
        <div className="container-main section-padding text-center relative z-10">
          <AnimatedSection>
            <h2 className="font-display font-bold text-primary-foreground text-2xl sm:text-[28px] md:text-[36px] lg:text-[40px] mb-4">
              Ready to speak with a specialist?
            </h2>
            <p className="text-primary-foreground/70 font-body text-base sm:text-lg mb-6 sm:mb-8 max-w-125 mx-auto">
              Our team is ready to help with refrigeration, air conditioning, or
              cold room solutions.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="tel:1300227600"
                className="btn-primary gap-2 w-full sm:w-auto"
              >
                <Phone className="w-4 h-4" /> Call 1300 227 600
              </a>
              <Link
                href="/contact"
                className="btn-outline-white w-full sm:w-auto"
              >
                Send an Enquiry
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
