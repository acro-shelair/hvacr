import type { Metadata } from "next";
import Link from "next/link";
import { Box, CheckCircle, Snowflake, Wind } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Our Brands | Acro Refrigeration, Shelair & Koolacube",
  description:
    "Discover HVACR Group's three specialist brands: Acro Refrigeration, Shelair air conditioning, and Koolacube relocatable cold rooms. Trusted across QLD and NSW.",
  alternates: { canonical: "/brands" },
};

const brands = [
  {
    name: "Acro Refrigeration",
    icon: Snowflake,
    specialty: "Commercial & Industrial Refrigeration",
    description:
      "Established in 1972, Acro Refrigeration is one of Queensland's longest-serving commercial refrigeration contractors. From cold rooms to industrial process cooling, Acro delivers end-to-end refrigeration solutions backed by decades of expertise.",
    services: [
      "Commercial cold room design & installation",
      "Industrial process cooling systems",
      "Supermarket refrigeration fit-outs",
      "Preventative maintenance programs",
      "24/7 emergency breakdown service",
    ],
  },
  {
    name: "Shelair",
    icon: Wind,
    specialty: "Air Conditioning & Climate Control",
    description:
      "Founded in 1993, Shelair delivers precision air conditioning solutions for commercial and institutional environments. From VRV/VRF system design to BMS integration, Shelair ensures optimal climate control across any scale of project.",
    services: [
      "VRV/VRF system design & installation",
      "Ducted & split system solutions",
      "Building Management System (BMS) integration",
      "Mechanical ventilation design",
      "Ongoing service & maintenance contracts",
    ],
  },
  {
    name: "Koolacube",
    icon: Box,
    specialty: "Relocatable Cold Rooms & Portable Refrigeration",
    description:
      "Launched in 2015, Koolacube provides innovative relocatable cold room and freezer room solutions. Purpose-built for events, emergencies, and temporary operations, Koolacube delivers rapid deployment without compromising on performance.",
    services: [
      "Modular cold & freezer rooms",
      "Event & festival cold storage",
      "Emergency & disaster response units",
      "Pharmaceutical-grade temperature control",
      "Short & long-term hire options",
    ],
  },
];

export default function BrandsPage() {
  return (
    <>
      <section className="section-padding bg-navy diagonal-texture -mt-[72px] pt-[172px]">
        <div className="container-main">
          <h1 className="font-display font-extrabold text-primary-foreground text-[36px] md:text-[56px] leading-tight mb-4">
            Our Brand Portfolio
          </h1>
          <p className="text-primary-foreground/70 font-body text-lg max-w-[550px]">
            Three specialist brands, each a leader in their field — united by HVACR Group&apos;s commitment to excellence.
          </p>
        </div>
      </section>

      {brands.map((brand, i) => {
        const reversed = i % 2 === 1;
        return (
          <section
            key={brand.name}
            className={`section-padding ${i % 2 === 0 ? "bg-card" : "bg-surface-alt"}`}
          >
            <div className="container-main">
              <AnimatedSection>
                <div className={`grid lg:grid-cols-12 gap-12 items-center ${reversed ? "lg:flex-row-reverse" : ""}`}>
                  <div className={`${reversed ? "lg:col-start-6 lg:col-span-7" : "lg:col-span-7"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <brand.icon className="w-8 h-8 text-accent" />
                      <span className="font-body text-accent font-medium text-sm uppercase tracking-wider">{brand.specialty}</span>
                    </div>
                    <h2 className="section-heading mb-4">{brand.name}</h2>
                    <p className="text-muted-foreground font-body text-[17px] leading-[1.7] mb-6">{brand.description}</p>
                    <ul className="space-y-3 mb-8">
                      {brand.services.map((s) => (
                        <li key={s} className="flex items-start gap-2 font-body text-foreground text-[15px]">
                          <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className="btn-primary">
                      Enquire About {brand.name.split(" ")[0]} →
                    </Link>
                  </div>
                  <div className={`${reversed ? "lg:col-start-1 lg:col-span-5 lg:row-start-1" : "lg:col-span-5"}`}>
                    <div className="bg-navy/5 rounded-2xl aspect-[4/3] flex items-center justify-center">
                      <brand.icon className="w-24 h-24 text-accent/30" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        );
      })}
    </>
  );
}
