"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/brands", label: "Our Brands" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-card/95 backdrop-blur-md border-b border-border shadow-[var(--shadow-header)]"
            : "bg-card/90 backdrop-blur-sm border-b border-border"
        }`}
      >
        <div className="container-main flex items-center justify-between h-[72px]">
          <Link href="/" aria-label="HVACR Group home" className="flex items-center">
            <Image
              src="/hvacr-logo-web.png"
              alt="HVACR Pty Ltd"
              width={330}
              height={90}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:1300227600"
              className="hidden md:inline-flex btn-primary rounded-full text-sm h-10 px-5 gap-2"
            >
              <Phone className="w-4 h-4" />
              CALL 1300 227 600
            </a>
            <button
              className="lg:hidden text-navy"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-navy flex flex-col items-center justify-center diagonal-texture">
          <button
            className="absolute top-5 right-5 text-primary-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>
          <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-3xl font-bold text-primary-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a href="tel:1300227600" className="btn-primary rounded-full mt-4 gap-2">
              <Phone className="w-4 h-4" />
              CALL 1300 227 600
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
