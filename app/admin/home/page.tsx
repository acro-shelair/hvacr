import Link from "next/link";
import {
  Tag,
  Building2,
  Inbox,
  HelpCircle,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Circle,
  Settings,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Dashboard | HVACR Admin" };

async function getCounts() {
  const db = createAdminClient();
  const [
    { count: brands },
    { count: industries },
    { count: msgTotal },
    { count: msgUnread },
    { count: faqs },
    { count: jobs },
    { count: appsUnread },
  ] = await Promise.all([
    db.from("brands").select("*", { count: "exact", head: true }),
    db.from("industries").select("*", { count: "exact", head: true }),
    db.from("messages").select("*", { count: "exact", head: true }),
    db
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    db.from("faqs").select("*", { count: "exact", head: true }),
    db.from("job_postings").select("*", { count: "exact", head: true }),
    db
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);
  return {
    brands: brands ?? 0,
    industries: industries ?? 0,
    msgTotal: msgTotal ?? 0,
    msgUnread: msgUnread ?? 0,
    faqs: faqs ?? 0,
    jobs: jobs ?? 0,
    appsUnread: appsUnread ?? 0,
  };
}

export default async function AdminHomePage() {
  const c = await getCounts();

  const connected = [
    {
      label: "Brands",
      icon: Tag,
      href: "/admin/brands",
      count: c.brands,
      desc: "Featured brands shown on the home page",
    },
    {
      label: "Industries",
      icon: Building2,
      href: "/admin/industries",
      count: c.industries,
      desc: "Industry cards shown on the home page",
    },
    {
      label: "Messages",
      icon: Inbox,
      href: "/admin/messages",
      count: c.msgTotal,
      desc: `${c.msgUnread > 0 ? `${c.msgUnread} unread · ` : ""}Contact form submissions`,
    },
    {
      label: "FAQs",
      icon: HelpCircle,
      href: "/admin/faqs",
      count: c.faqs,
      desc: "FAQ accordion on the home page",
    },
    {
      label: "Careers",
      icon: Briefcase,
      href: "/admin/careers",
      count: c.jobs,
      desc: `${c.appsUnread > 0 ? `${c.appsUnread} new app${c.appsUnread !== 1 ? "s" : ""} · ` : ""}Job postings & applications`,
    },
  ];

  const staticSections = [
    "Hero (headline, subheading, CTAs)",
    "Trust Bar (certifications, stats)",
    "About Section (company overview)",
    "Services Overview (service cards)",
    "Process Timeline (how it works)",
    "CTA Banner",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Home Page</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage home page sections. Connected sections update live; static
            sections require a code change.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-sm font-medium border border-border rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          <Settings className="w-4 h-4" /> Site Settings
        </Link>
      </div>

      {/* Connected sections */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" /> Connected to
          Supabase
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {connected.map(({ label, icon: Icon, href, count, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3.5 hover:border-accent/40 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm group-hover:text-accent transition-colors">
                    {label}
                  </p>
                  <span className="text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md font-medium">
                    {count}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Static sections */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Circle className="w-4 h-4 text-muted-foreground" /> Static Sections
          <span className="text-xs font-normal text-muted-foreground">
            (edit in code)
          </span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {staticSections.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground"
            >
              <Circle className="w-3 h-3 shrink-0" />
              {s}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
