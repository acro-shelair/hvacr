import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import FaqAccordion from "@/components/FaqAccordion";
import AnimatedSection from "@/components/AnimatedSection";
import { MessageCircleQuestion, Phone } from "lucide-react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Frequently Asked Questions | HVACR Group",
  url: "https://hvacrgroup.com.au/faqs",
  description:
    "Answers to the most common questions about HVACR Group's services, licensing, coverage, and trade processes.",
};

export const metadata: Metadata = {
  title: "FAQs | HVACR Group",
  description:
    "Answers to the most common questions about HVACR Group's services, licensing, coverage, and trade processes.",
  alternates: { canonical: "https://hvacrgroup.com.au/faqs" },
  openGraph: {
    title: "FAQs | HVACR Group",
    description:
      "Answers to the most common questions about HVACR Group's services, licensing, coverage, and trade processes.",
    url: "https://hvacrgroup.com.au/faqs",
  },
  twitter: {
    title: "FAQs | HVACR Group",
    description:
      "Answers to the most common questions about HVACR Group's services, licensing, coverage, and trade processes.",
  },
};

export default async function FaqsPage() {
  const supabase = await createClient();

  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, answer")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const publishedFaqs = faqs ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-navy diagonal-texture -mt-18 pt-26 sm:pt-32 md:pt-43 pb-14 sm:pb-16 md:pb-20 lg:pb-25">
        <div className="container-main">
          <p className="hero-eyebrow mb-3 sm:mb-4">Got Questions?</p>
          <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[56px] leading-tight mb-4">
            Frequently Asked{" "}
            <span className="border-b-4 border-accent pb-1">Questions</span>.
          </h1>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-137.5">
            Can&apos;t find what you&apos;re looking for? Call us on{" "}
            <a
              href="tel:1300227600"
              className="text-accent font-medium hover:underline"
            >
              1300 227 600
            </a>{" "}
            and we&apos;ll be happy to help.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-card">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12 sm:mb-14">
                <p className="hero-eyebrow mb-3">All Answers</p>
                <h2 className="section-heading">Common Questions</h2>
                <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                  Everything you need to know about working with HVACR Group —
                  from first enquiry to ongoing support.
                </p>
              </div>
            </AnimatedSection>

            {publishedFaqs.length > 0 ? (
              <FaqAccordion faqs={publishedFaqs} />
            ) : (
              <AnimatedSection>
                <div className="text-center py-16 card-elevated">
                  <MessageCircleQuestion className="w-12 h-12 text-accent/50 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-charcoal text-xl mb-2">
                    No FAQs published yet
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Check back soon — or reach out directly and we&apos;ll
                    answer your question personally.
                  </p>
                  <a
                    href="/contact"
                    className="btn-primary rounded-full mt-6 inline-flex"
                  >
                    Contact Us
                  </a>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="section-padding bg-surface diagonal-texture-light">
        <div className="container-main">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <p className="hero-eyebrow mb-3">Still Unsure?</p>
              <h2 className="section-heading mb-5">
                Talk to Our Team Directly
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                Our trade specialists are available Monday to Friday, 7am – 5pm.
                For emergencies, we&apos;re available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/contact" className="btn-primary rounded-full px-8">
                  Send an Enquiry
                </a>
                <a
                  href="tel:1300227600"
                  className="btn-outline-navy rounded-full px-8 gap-2"
                >
                  <Phone className="w-4 h-4" />
                  1300 227 600
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
