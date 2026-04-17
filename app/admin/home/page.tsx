import Link from "next/link";
import { Tag, Building2, Inbox, HelpCircle, Briefcase, ArrowRight } from "lucide-react";
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
    db.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    db.from("faqs").select("*", { count: "exact", head: true }),
    db.from("job_postings").select("*", { count: "exact", head: true }),
    db.from("job_applications").select("*", { count: "exact", head: true }).eq("is_read", false),
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

  const sections = [
    {
      label: "Brands",
      href: "/admin/brands",
      icon: Tag,
      sub: `${c.brands} total`,
    },
    {
      label: "Industries",
      href: "/admin/industries",
      icon: Building2,
      sub: `${c.industries} total`,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: Inbox,
      sub: `${c.msgTotal} total`,
      badge: c.msgUnread > 0 ? `${c.msgUnread} unread` : undefined,
    },
    {
      label: "FAQs",
      href: "/admin/faqs",
      icon: HelpCircle,
      sub: `${c.faqs} total`,
    },
    {
      label: "Careers",
      href: "/admin/careers",
      icon: Briefcase,
      sub: `${c.jobs} job${c.jobs !== 1 ? "s" : ""}`,
      badge: c.appsUnread > 0 ? `${c.appsUnread} new app${c.appsUnread !== 1 ? "s" : ""}` : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your site content.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Sections</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {sections.map(({ label, href, icon: Icon, sub, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3.5 hover:border-accent/40 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm group-hover:text-accent transition-colors">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sub}
                  {badge && (
                    <span className="ml-2 text-destructive font-medium">· {badge}</span>
                  )}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
