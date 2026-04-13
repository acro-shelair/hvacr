import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/brands", label: "Our Brands" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="bg-navy diagonal-texture text-primary-foreground">
      <div className="container-main py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="bg-white rounded-md inline-block p-3 mb-4">
              <Image
                src="/hvacr-logo-web.png"
                alt="HVACR Pty Ltd"
                width={330}
                height={90}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">
              Queensland&apos;s most trusted refrigeration and climate control group. Three specialist brands united by quality, compliance, and lasting relationships.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-primary-foreground/70 hover:text-accent transition-colors text-sm font-body"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contact</h4>
            <address className="not-italic text-primary-foreground/70 text-sm font-body space-y-2">
              <p>Kelvin Grove, QLD 4059</p>
              <p>
                <a href="tel:1300227600" className="hover:text-accent transition-colors">
                  1300 227 600
                </a>
              </p>
              <p>
                <a href="mailto:info@hvacrgroup.com.au" className="hover:text-accent transition-colors">
                  info@hvacrgroup.com.au
                </a>
              </p>
              <p className="pt-2 text-primary-foreground/50 text-xs">ABN: XX XXX XXX XXX</p>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-accent/30">
        <div className="container-main py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-xs font-body">
            © {new Date().getFullYear()} HVACR Group Pty Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-primary-foreground/40 text-xs font-body">
            <span>ARCtick Licensed</span>
            <span>QBCC Certified</span>
            <span>Veteran-Owned</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
