import type { Metadata } from "next";
import {
  Thermometer,
  Wind,
  Snowflake,
  Wrench,
  Building2,
  Zap,
  CheckCircle2,
  Phone,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "HVACR Group Services",
  url: "https://hvacrgroup.com.au/services",
  description:
    "Comprehensive HVAC and refrigeration services across Queensland — from commercial air conditioning to cold room construction and emergency repairs.",
  provider: {
    "@type": "Organization",
    name: "HVACR Group",
    url: "https://hvacrgroup.com.au",
    telephone: "+611300227600",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kelvin Grove",
      addressRegion: "QLD",
      postalCode: "4059",
      addressCountry: "AU",
    },
  },
  areaServed: [
    { "@type": "State", name: "Queensland" },
    { "@type": "State", name: "New South Wales" },
  ],
  serviceType: [
    "Commercial Refrigeration",
    "Air Conditioning Installation",
    "Cold Room Construction",
    "HVAC Maintenance",
    "Industrial Cooling",
    "Emergency Repairs",
  ],
};

export const metadata: Metadata = {
  title: "Our Services | HVACR Group",
  description:
    "Comprehensive HVAC and refrigeration services across Queensland — commercial air conditioning, cold room construction, industrial cooling, and 24/7 emergency repairs.",
  alternates: { canonical: "https://hvacrgroup.com.au/services" },
  openGraph: {
    title: "Our Services | HVACR Group",
    description:
      "Comprehensive HVAC and refrigeration services across Queensland — commercial air conditioning, cold room construction, industrial cooling, and 24/7 emergency repairs.",
    url: "https://hvacrgroup.com.au/services",
  },
  twitter: {
    title: "Our Services | HVACR Group",
    description:
      "Comprehensive HVAC and refrigeration services across Queensland — commercial air conditioning, cold room construction, industrial cooling, and 24/7 emergency repairs.",
  },
};

const services = [
  {
    icon: Wind,
    title: "Commercial Air Conditioning",
    description:
      "Design, supply, and installation of commercial HVAC systems for offices, retail centres, hospitals, and industrial facilities. We size, specify, and commission systems built to last.",
    features: [
      "Ducted & split systems",
      "VRF/VRV multi-zone systems",
      "Building management integration",
      "Energy efficiency assessments",
    ],
  },
  {
    icon: Snowflake,
    title: "Commercial Refrigeration",
    description:
      "Full-scope refrigeration solutions for supermarkets, food processing plants, distribution centres, and hospitality venues. ARCtick certified technicians across all refrigerant types.",
    features: [
      "Display case & coolroom fit-outs",
      "Remote condensing units",
      "Low-temp freezer systems",
      "Refrigerant management",
    ],
  },
  {
    icon: Building2,
    title: "Cold Room Construction",
    description:
      "Custom-engineered cold rooms and freezer rooms built to your exact specifications. From panel selection to refrigeration plant, we handle end-to-end construction and commissioning.",
    features: [
      "Walk-in coolrooms & freezers",
      "Insulated panel systems",
      "HACCP-compliant designs",
      "Blast chiller integration",
    ],
  },
  {
    icon: Wrench,
    title: "Preventative Maintenance",
    description:
      "Scheduled maintenance programs that extend equipment life, reduce energy costs, and prevent costly breakdowns. Tailored service agreements for single sites or national portfolios.",
    features: [
      "Planned maintenance schedules",
      "Filter & coil servicing",
      "Performance reporting",
      "Compliance documentation",
    ],
  },
  {
    icon: Thermometer,
    title: "Industrial Cooling Systems",
    description:
      "Heavy-duty process cooling solutions for manufacturing, pharmaceutical, mining, and data centre environments. We engineer systems that handle the toughest thermal loads.",
    features: [
      "Process chillers & cooling towers",
      "Glycol & brine systems",
      "Data centre precision cooling",
      "Custom industrial design",
    ],
  },
  {
    icon: Zap,
    title: "Emergency Repairs",
    description:
      "24/7 emergency response for breakdowns — because refrigeration failure can't wait. Our rapid-response teams are dispatched across QLD and NSW to get you back up fast.",
    features: [
      "24/7 call-out availability",
      "Same-day response target",
      "All major brands serviced",
      "Loan equipment available",
    ],
  },
];

const whyChoose = [
  "50+ years of combined trade experience",
  "ARCtick & QBCC licensed technicians",
  "ISO-aligned quality management",
  "Serving QLD & NSW",
  "Dedicated account management",
  "Transparent, fixed-price quoting",
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-navy diagonal-texture -mt-18 pt-26 sm:pt-32 md:pt-43 pb-14 sm:pb-16 md:pb-20 lg:pb-25">
        <div className="container-main">
          <p className="hero-eyebrow mb-3 sm:mb-4">What We Do</p>
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-4">
            Trade Services Built for{" "}
            <span className="border-b-4 border-accent pb-1">Business</span>.
          </h1>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-137.5">
            From commercial air conditioning to industrial refrigeration — we
            deliver end-to-end HVAC solutions across Queensland and New South
            Wales.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-card">
        <div className="container-main">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="hero-eyebrow mb-3">Our Capabilities</p>
              <h2 className="section-heading">
                Specialist Services, Every Trade
              </h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                Three specialist brands operating as one. Whatever the scope,
                our teams have the licensing, equipment, and experience to
                deliver.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <AnimatedSection key={service.title} delay={i * 0.08}>
                  <div className="card-elevated h-full flex flex-col group hover:-translate-y-1.5 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display font-bold text-charcoal text-lg sm:text-xl mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <ul className="mt-auto space-y-2">
                      {service.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-sm text-charcoal/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-surface diagonal-texture-light">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <p className="hero-eyebrow mb-3">Why HVACR Group</p>
              <h2 className="section-heading mb-5">
                The Credentials That Matter
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                When you engage HVACR Group, you get the backing of three
                specialist brands — combined experience, shared resources, and a
                single point of accountability.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {whyChoose.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-charcoal text-[15px] font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-navy rounded-2xl p-8 sm:p-10 diagonal-texture relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-accent font-display font-bold text-[40px] sm:text-[56px] leading-none mb-2">
                    50+
                  </p>
                  <p className="text-primary-foreground/80 text-base mb-8">
                    Years of combined trade experience across our three brands.
                  </p>
                  <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                    <div>
                      <p className="text-accent font-display font-bold text-3xl sm:text-4xl leading-none mb-1">
                        QLD
                      </p>
                      <p className="text-primary-foreground/70 text-sm">
                        & NSW coverage
                      </p>
                    </div>
                    <div>
                      <p className="text-accent font-display font-bold text-3xl sm:text-4xl leading-none mb-1">
                        24/7
                      </p>
                      <p className="text-primary-foreground/70 text-sm">
                        Emergency response
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy diagonal-texture">
        <div className="container-main text-center">
          <AnimatedSection>
            <p className="hero-eyebrow mb-3">Ready to Start?</p>
            <h2 className="font-display font-extrabold text-primary-foreground text-[28px] sm:text-[36px] md:text-[44px] leading-tight mb-5 max-w-2xl mx-auto">
              Speak to a Trade Specialist Today
            </h2>
            <p className="text-primary-foreground/75 text-base sm:text-lg max-w-lg mx-auto mb-8">
              Get a no-obligation quote for your next project. Our team responds
              within one business day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="btn-primary rounded-full px-8">
                Request a Quote
              </a>
              <a
                href="tel:1300227600"
                className="btn-outline-white rounded-full px-8 gap-2"
              >
                <Phone className="w-4 h-4" />
                1300 227 600
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
