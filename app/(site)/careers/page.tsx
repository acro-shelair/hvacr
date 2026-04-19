import type { Metadata } from "next";
import { Award, MapPin, Send, TrendingUp, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import ApplyButton from "./ApplyButton";
import JobDescription from "./JobDescription";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EmployerAggregateRating",
  itemReviewed: {
    "@type": "Organization",
    name: "HVACR Group",
    url: "https://hvacrgroup.com.au",
    sameAs: "https://hvacrgroup.com.au/about",
  },
  hiringOrganization: {
    "@type": "Organization",
    name: "HVACR Group",
    url: "https://hvacrgroup.com.au",
    logo: "https://hvacrgroup.com.au/hvacr-logo-web.webp",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kelvin Grove",
      addressRegion: "QLD",
      postalCode: "4059",
      addressCountry: "AU",
    },
  },
  occupationalCategory:
    "Refrigeration Mechanic, Air Conditioning Technician, HVAC Engineer",
  jobLocationType: "TELECOMMUTE",
  applicantLocationRequirements: {
    "@type": "Country",
    name: "Australia",
  },
};

export const metadata: Metadata = {
  title: "Careers at HVACR Group | HVAC Jobs in QLD & NSW",
  description:
    "Join HVACR Group — one of Queensland's leading refrigeration and air conditioning employers. Explore career opportunities across Acro Refrigeration, Shelair and Koolacube.",
  alternates: { canonical: "https://hvacrgroup.com.au/careers" },
  openGraph: {
    title: "Careers at HVACR Group | HVAC Jobs in QLD & NSW",
    description:
      "Join HVACR Group — one of Queensland's leading refrigeration and air conditioning employers. Explore career opportunities across Acro Refrigeration, Shelair and Koolacube.",
    url: "https://hvacrgroup.com.au/careers",
  },
  twitter: {
    title: "Careers at HVACR Group | HVAC Jobs in QLD & NSW",
    description:
      "Join HVACR Group — one of Queensland's leading refrigeration and air conditioning employers. Explore career opportunities across Acro Refrigeration, Shelair and Koolacube.",
  },
};

const reasons = [
  {
    icon: Users,
    title: "Family Culture",
    desc: "We're a tight-knit group that values respect, collaboration and looking after our people.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Structured pathways for apprentices, tradespeople and managers across three specialist brands.",
  },
  {
    icon: Award,
    title: "Industry Leaders",
    desc: "Work with the best equipment, systems and clients in the refrigeration and HVAC sector.",
  },
];

export default async function CareersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_postings")
    .select("id, title, location, employment_type, description")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const postings = data ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-navy diagonal-texture -mt-18 pt-26 sm:pt-32 md:pt-43 pb-14 sm:pb-16 md:pb-20 lg:pb-25">
        <div className="container-main">
          <p className="hero-eyebrow mb-3 sm:mb-4">Grow your career with us</p>
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-4">
            Join the{" "}
            <span className="border-b-4 border-accent pb-1">
              HVACR Group Family
            </span>
            .
          </h1>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-137.5">
            Build your career with one of Queensland&apos;s most respected trade
            services groups.
          </p>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-main">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <h2 className="section-heading mb-4">Why Work With Us</h2>
            <p className="text-muted-foreground font-body text-base sm:text-lg max-w-137.5 mx-auto">
              We invest in our people because they&apos;re the foundation of
              everything we do.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reasons.map((r, i) => (
              <AnimatedSection key={r.title} delay={i * 0.1}>
                <div className="brand-card text-center h-full">
                  <r.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-display font-bold text-charcoal text-lg mb-2">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT OPENINGS */}
      <section className="section-padding bg-surface-alt">
        <div className="container-main">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <h2 className="section-heading mb-4">Current Openings</h2>
            <p className="text-muted-foreground font-body text-base sm:text-lg max-w-137.5 mx-auto">
              Explore available positions across our three specialist brands.
            </p>
          </AnimatedSection>

          {postings.length > 0 ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {postings.map((job, i) => (
                <AnimatedSection key={job.id} delay={i * 0.08}>
                  <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <h3 className="font-display font-bold text-charcoal text-lg sm:text-xl">
                        {job.title}
                      </h3>
                      <span className="inline-flex items-center self-start shrink-0 bg-accent/10 text-accent font-body font-medium text-xs px-3 py-1 rounded-full">
                        {job.employment_type}
                      </span>
                    </div>
                    {job.location && (
                      <p className="flex items-center gap-1.5 text-muted-foreground font-body text-sm mb-3">
                        <MapPin className="w-4 h-4 shrink-0" />
                        {job.location}
                      </p>
                    )}
                    {job.description && (
                      <JobDescription text={job.description} />
                    )}
                    <ApplyButton
                      jobPostingId={job.id}
                      position={job.title}
                      className="inline-flex items-center gap-2 mt-4 text-accent font-body font-medium text-sm hover:underline"
                    >
                      <Send className="w-4 h-4" /> Apply for this role
                    </ApplyButton>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 text-center border border-border">
                <p className="text-muted-foreground font-body text-base">
                  No positions are currently listed. Check back soon or send a
                  speculative application below.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-main">
          <AnimatedSection>
            <div className="bg-accent rounded-2xl p-6 sm:p-10 md:p-16 text-center">
              <Send className="w-10 h-10 sm:w-12 sm:h-12 text-accent-foreground mx-auto mb-4" />
              <h2 className="font-display font-bold text-accent-foreground text-2xl sm:text-[28px] md:text-[36px] mb-4">
                Ready to Apply?
              </h2>
              <p className="text-accent-foreground/90 font-body text-base sm:text-lg mb-6 max-w-122.5 mx-auto">
                Send your resume and a cover letter to our recruitment team.
              </p>
              <ApplyButton className="inline-flex items-center justify-center bg-navy text-primary-foreground font-body font-medium px-5 sm:px-8 h-12 sm:h-13 rounded-lg transition-transform duration-200 hover:scale-[1.03] text-sm sm:text-[15px] gap-2 w-full sm:w-auto">
                <Send className="w-4 h-4 shrink-0" />
                <span>Submit Your Application</span>
              </ApplyButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
