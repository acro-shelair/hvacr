import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ContactForm from "./ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact HVACR Group | 1300 227 600 | Kelvin Grove QLD",
  description:
    "Get in touch with HVACR Group for refrigeration, air conditioning and cold room enquiries. Call 1300 227 600 or visit us in Kelvin Grove, Brisbane.",
  alternates: { canonical: "https://hvacrgroup.com.au/contact" },
  openGraph: {
    title: "Contact HVACR Group | 1300 227 600 | Kelvin Grove QLD",
    description:
      "Get in touch with HVACR Group for refrigeration, air conditioning and cold room enquiries. Call 1300 227 600 or visit us in Kelvin Grove, Brisbane.",
    url: "https://hvacrgroup.com.au/contact",
  },
  twitter: {
    title: "Contact HVACR Group | 1300 227 600 | Kelvin Grove QLD",
    description:
      "Get in touch with HVACR Group for refrigeration, air conditioning and cold room enquiries. Call 1300 227 600 or visit us in Kelvin Grove, Brisbane.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HVACR Group",
  url: "https://hvacrgroup.com.au",
  logo: "https://hvacrgroup.com.au/hvacr-logo-web.webp",
  image: "https://hvacrgroup.com.au/og-image.jpg",
  telephone: "+611300227600",
  email: "info@hvacrgroup.com.au",
  priceRange: "$$",
  openingHours: "Mo-Fr 07:00-17:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kelvin Grove",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    postalCode: "4059",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -27.45,
    longitude: 153.012,
  },
  areaServed: [
    { "@type": "State", name: "Queensland" },
    { "@type": "State", name: "New South Wales" },
  ],
  serviceType: [
    "Commercial Refrigeration",
    "Industrial Air Conditioning",
    "Cold Room Installation",
    "HVAC Maintenance",
  ],
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["contact_phone", "contact_email", "contact_address"]);

  const settings: Record<string, string> = {};
  for (const row of data ?? []) settings[row.key] = row.value;

  const phone = settings.contact_phone || "1300 227 600";
  const email = settings.contact_email || "info@hvacrgroup.com.au";
  const address = settings.contact_address || "Kelvin Grove, QLD 4059";
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const emailHref = `mailto:${email}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-navy diagonal-texture -mt-18 pt-26 sm:pt-32 md:pt-43 pb-14 sm:pb-16 md:pb-20 lg:pb-25">
        <div className="container-main">
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-112.5">
            We&apos;d love to hear from you. Reach out for a quote, enquiry, or
            to discuss your project.
          </p>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-main">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
            <AnimatedSection className="lg:col-span-7">
              <h2 className="section-heading mb-6 sm:mb-8">Get in Touch</h2>
              <ContactForm />
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-5" delay={0.15}>
              <div className="bg-navy diagonal-texture rounded-2xl p-6 sm:p-8 text-primary-foreground">
                <h3 className="font-display font-bold text-lg sm:text-xl mb-5 sm:mb-6">
                  Contact Details
                </h3>
                <address className="not-italic space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-0.5" />
                    <p className="font-body text-sm text-primary-foreground/80 whitespace-pre-line">
                      {address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <a
                      href={phoneHref}
                      className="font-body text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <a
                      href={emailHref}
                      className="font-body text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </address>

                <div className="mt-8 rounded-xl overflow-hidden">
                  <iframe
                    title="HVACR Group location map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.8!2d153.012!3d-27.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDI3JzAwLjAiUyAxNTPCsDAwJzQzLjIiRQ!5e0!3m2!1sen!2sau!4v1234567890"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <p className="text-primary-foreground/50 font-body text-xs mt-6">
                  For brand-specific enquiries, please select the relevant
                  option in the enquiry form.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
