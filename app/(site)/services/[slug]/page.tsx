import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Phone,
  ArrowRight,
  Clock,
  ShieldCheck,
  Award,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServiceIcon } from "@/lib/serviceIcons";

type ProcessStep = { step: string; title: string; description: string };
type Stat = { value: string; label: string };

type Service = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  hero_description: string;
  icon_name: string;
  overview: string;
  features: string[];
  process: ProcessStep[];
  stats: Stat[];
  related_services: string[];
  meta_title: string;
  meta_description: string;
  schema_json: Record<string, unknown> | null;
  cta_eyebrow: string;
  cta_heading: string;
  cta_body: string;
  cta_btn1_label: string;
  cta_btn1_href: string;
  cta_btn2_label: string;
  cta_btn2_href: string;
  is_published: boolean;
};

const credentials = [
  { icon: ShieldCheck, label: "ARCtick Certified" },
  { icon: Award, label: "QBCC Licensed" },
  { icon: Clock, label: "24/7 Emergency" },
];

async function getService(slug: string): Promise<Service | null> {
  const db = createAdminClient();
  const { data } = await db
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as Service | null;
}

async function getAllServices(): Promise<Service[]> {
  const db = createAdminClient();
  const { data } = await db
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as Service[];
}

export const revalidate = 0; //change to 60 if you want it to change only every 60 seconds

export async function generateStaticParams() {
  const db = createAdminClient();
  const { data } = await db
    .from("services")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.meta_title,
    description: service.meta_description,
    alternates: {
      canonical: `https://hvacrgroup.com.au/services/${slug}`,
    },
    openGraph: {
      title: service.meta_title,
      description: service.meta_description,
      url: `https://hvacrgroup.com.au/services/${slug}`,
    },
    twitter: {
      title: service.meta_title,
      description: service.meta_description,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getService(slug),
    getAllServices(),
  ]);

  if (!service) notFound();

  const Icon = getServiceIcon(service.icon_name);

  const serviceMap = Object.fromEntries(allServices.map((s) => [s.slug, s]));
  const relatedServices = (service.related_services ?? [])
    .map((s) => serviceMap[s])
    .filter(Boolean) as Service[];

  return (
    <>
      {service.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(service.schema_json),
          }}
        />
      )}

      {/* Hero */}
      <section className="bg-navy diagonal-texture -mt-18 pt-26 sm:pt-32 md:pt-43 pb-14 sm:pb-16 md:pb-20 lg:pb-25">
        <div className="container-main">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/services"
              className="text-primary-foreground/50 hover:text-accent text-sm font-medium transition-colors"
            >
              Services
            </Link>
            <span className="text-primary-foreground/30 text-sm">/</span>
            <span className="text-accent text-sm font-medium">
              {service.eyebrow}
            </span>
          </div>
          <div className="flex items-start gap-5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0 mt-1">
              <Icon className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="hero-eyebrow mb-2">{service.eyebrow}</p>
              <h1 className="font-display font-extrabold text-primary-foreground text-[32px] sm:text-[40px] md:text-[52px] leading-tight">
                {service.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="border-b-4 border-accent pb-1">
                  {service.title.split(" ").slice(-1)[0]}
                </span>
                .
              </h1>
            </div>
          </div>
          <p className="text-primary-foreground/70 font-body text-base sm:text-lg max-w-2xl mt-4 ml-0 sm:ml-19">
            {service.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:ml-19">
            <Link
              href={service.cta_btn1_href}
              className="btn-primary rounded-full px-7"
            >
              {service.cta_btn1_label}
            </Link>
            <a
              href={service.cta_btn2_href}
              className="btn-outline-white rounded-full px-7 gap-2"
            >
              <Phone className="w-4 h-4" />
              {service.cta_btn2_label}
            </a>
          </div>
        </div>
      </section>

      {/* Overview + Features */}
      <section className="section-padding bg-card">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <AnimatedSection>
              <p className="hero-eyebrow mb-3">Overview</p>
              <h2 className="section-heading mb-5">What We Deliver</h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                {service.overview}
              </p>
              <div className="flex flex-wrap gap-3">
                {credentials.map(({ icon: CredIcon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 text-sm font-medium text-charcoal"
                  >
                    <CredIcon className="w-4 h-4 text-accent" />
                    {label}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="card-elevated">
                <h3 className="font-display font-bold text-charcoal text-lg mb-5">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-[15px] text-charcoal/80"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-surface diagonal-texture-light">
        <div className="container-main">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <p className="hero-eyebrow mb-3">How It Works</p>
              <h2 className="section-heading">Our Process</h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                A clear, structured approach from first contact to project
                completion — so you always know what to expect next.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.1}>
                <div className="card-elevated h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-display font-extrabold text-accent text-3xl leading-none">
                      {step.step}
                    </span>
                    <div className="flex-1 h-px bg-accent/20" />
                  </div>
                  <h3 className="font-display font-bold text-charcoal text-base sm:text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy py-10 sm:py-12">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24">
            {service.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-extrabold text-accent text-3xl sm:text-4xl leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-card">
          <div className="container-main">
            <AnimatedSection>
              <div className="mb-10">
                <p className="hero-eyebrow mb-3">Explore More</p>
                <h2 className="section-heading">Related Services</h2>
              </div>
            </AnimatedSection>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedServices.map((rel, i) => {
                const RelIcon = getServiceIcon(rel.icon_name);
                return (
                  <AnimatedSection key={rel.slug} delay={i * 0.08}>
                    <Link
                      href={`/services/${rel.slug}`}
                      className="card-elevated flex flex-col group hover:-translate-y-1.5 transition-transform duration-300 no-underline h-full"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                        <RelIcon className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-display font-bold text-charcoal text-base sm:text-lg mb-2">
                        {rel.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {rel.hero_description.split("—")[0].trim()}
                      </p>
                      <div className="flex items-center gap-1.5 text-accent text-sm font-medium mt-4">
                        Learn more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-navy diagonal-texture">
        <div className="container-main text-center">
          <AnimatedSection>
            <p className="hero-eyebrow mb-3">{service.cta_eyebrow}</p>
            <h2 className="font-display font-extrabold text-primary-foreground text-[28px] sm:text-[36px] md:text-[44px] leading-tight mb-5 max-w-2xl mx-auto">
              {service.cta_heading}
            </h2>
            <p className="text-primary-foreground/75 text-base sm:text-lg max-w-lg mx-auto mb-8">
              {service.cta_body}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={service.cta_btn1_href}
                className="btn-primary rounded-full px-8"
              >
                {service.cta_btn1_label}
              </Link>
              <a
                href={service.cta_btn2_href}
                className="btn-outline-white rounded-full px-8 gap-2"
              >
                <Phone className="w-4 h-4" />
                {service.cta_btn2_label}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
