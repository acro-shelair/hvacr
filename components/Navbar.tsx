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
  { href: "/services", label: "Services" },
  { href: "/faqs", label: "FAQs" },
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
            ? "bg-card/95 backdrop-blur-md border-b border-border shadow-(--shadow-header)"
            : "bg-card/90 backdrop-blur-sm border-b border-border"
        }`}
      >
        <div className="container-main flex items-center justify-between h-18 gap-3">
          <Link
            href="/"
            aria-label="HVACR Group home"
            className="flex items-center shrink-0"
          >
            <Image
              src="/hvacr-logo-web.webp"
              alt="HVACR Pty Ltd"
              width={330}
              height={90}
              priority
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8"
            aria-label="Main navigation"
          >
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

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:1300227600"
              className="hidden md:inline-flex btn-primary rounded-full text-xs lg:text-sm h-10 px-4 lg:px-5 gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">CALL </span>1300 227 600
            </a>
            <a
              href="tel:1300227600"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-accent text-accent-foreground"
              aria-label="Call 1300 227 600"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              className="lg:hidden text-navy p-2 -mr-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-60 bg-navy flex flex-col items-center justify-center diagonal-texture overflow-y-auto px-6 py-20">
          <button
            className="absolute top-4 right-4 text-primary-foreground p-2"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
          <nav
            className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-xs"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:1300227600"
              className="btn-primary rounded-full mt-4 gap-2 w-full"
            >
              <Phone className="w-4 h-4" />
              CALL 1300 227 600
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
