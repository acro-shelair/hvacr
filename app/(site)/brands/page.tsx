import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import { getIcon } from "@/lib/icons";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "HVACR Group Brand Portfolio",
  description:
    "Three specialist trade service brands united under HVACR Group.",
  url: "https://hvacrgroup.com.au/brands",
  numberOfItems: 3,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Organization",
        name: "Acro Refrigeration",
        description:
          "Queensland's leading commercial and industrial refrigeration specialist, established 1972.",
        parentOrganization: { "@type": "Organization", name: "HVACR Group" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Organization",
        name: "Shelair",
        description:
          "Commercial and industrial air conditioning specialist serving QLD and NSW.",
        parentOrganization: { "@type": "Organization", name: "HVACR Group" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Organization",
        name: "Koolacube",
        description:
          "Relocatable and modular cold room solutions for commercial clients.",
        parentOrganization: { "@type": "Organization", name: "HVACR Group" },
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Our Brands | Acro Refrigeration, Shelair & Koolacube",
  description:
    "Discover HVACR Group's three specialist brands: Acro Refrigeration, Shelair air conditioning, and Koolacube relocatable cold rooms. Trusted across QLD and NSW.",
  alternates: { canonical: "https://hvacrgroup.com.au/brands" },
  openGraph: {
    title: "Our Brands | Acro Refrigeration, Shelair & Koolacube",
    description:
      "Discover HVACR Group's three specialist brands: Acro Refrigeration, Shelair air conditioning, and Koolacube relocatable cold rooms. Trusted across QLD and NSW.",
    url: "https://hvacrgroup.com.au/brands",
  },
  twitter: {
    title: "Our Brands | Acro Refrigeration, Shelair & Koolacube",
    description:
      "Discover HVACR Group's three specialist brands: Acro Refrigeration, Shelair air conditioning, and Koolacube relocatable cold rooms. Trusted across QLD and NSW.",
  },
};

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select(
      "id, name, slug, specialty, description, services, logo_url, icon, website_url"
    )
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const brands = data ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-navy diagonal-texture -mt-18 pt-26 sm:pt-32 md:pt-43 pb-14 sm:pb-16 md:pb-20 lg:pb-25">
        <div className="container-main">
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-4">
            Our Brand Portfolio
          </h1>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-137.5">
            Three specialist brands, each a leader in their field — united by
            HVACR Group&apos;s commitment to excellence.
          </p>
        </div>
      </section>

      {brands.map((brand, i) => {
        const reversed = i % 2 === 1;
        const BrandIcon = getIcon(brand.icon);
        const services: string[] = Array.isArray(brand.services)
          ? brand.services
          : [];

        return (
          <section
            key={brand.id}
            className={`section-padding ${
              i % 2 === 0 ? "bg-card" : "bg-surface-alt"
            }`}
          >
            <div className="container-main">
              <AnimatedSection>
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div
                    className={`order-2 ${
                      reversed
                        ? "lg:order-2 lg:col-start-6 lg:col-span-7"
                        : "lg:order-1 lg:col-span-7"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <BrandIcon className="w-7 h-7 sm:w-8 sm:h-8 text-accent shrink-0" />
                      <span className="font-body text-accent font-medium text-xs sm:text-sm uppercase tracking-wider">
                        {brand.specialty}
                      </span>
                    </div>
                    <h2 className="section-heading mb-3 sm:mb-4">
                      {brand.name}
                    </h2>
                    <p className="text-muted-foreground font-body text-base sm:text-[17px] leading-[1.7] mb-5 sm:mb-6">
                      {brand.description}
                    </p>
                    <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                      {services.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 font-body text-foreground text-sm sm:text-[15px]"
                        >
                          <CheckCircle className="w-4 h-4 text-accent mt-1 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`${brand.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full sm:w-auto"
                    >
                      Visit {brand.name.split(" ")[0]} →
                    </Link>
                  </div>
                  <div
                    className={`order-1 ${
                      reversed
                        ? "lg:order-1 lg:col-start-1 lg:col-span-5 lg:row-start-1"
                        : "lg:order-2 lg:col-span-5"
                    }`}
                  >
                    <div className="bg-navy/5 rounded-2xl aspect-4/3 flex items-center justify-center overflow-hidden">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt={`${brand.name} logo`}
                          width={320}
                          height={240}
                          className="object-contain p-8"
                          style={{ width: "auto", height: "auto" }}
                        />
                      ) : (
                        <BrandIcon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-accent/30" />
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        );
      })}

      {brands.length === 0 && (
        <section className="section-padding bg-card">
          <div className="container-main text-center text-muted-foreground font-body">
            No brands available at this time.
          </div>
        </section>
      )}
    </>
  );
}
