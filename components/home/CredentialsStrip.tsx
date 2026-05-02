"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import arctick from "@/assets/creds/arctick.webp";
import qbcc from "@/assets/creds/qbcc.webp";
import nsw from "@/assets/creds/nsw.webp";
import neca from "@/assets/creds/neca.webp";
import vcb from "@/assets/creds/vcb.webp";

const credentials = [
  {
    logo: arctick,
    alt: "ARCtick Certified",
    label: "ARCtick Certified",
    lines: ["Licence 61340", "PQC No. 3210O"],
  },
  {
    logo: qbcc,
    alt: "QBCC",
    label: "QBCC",
    lines: ["QBCC 15413155", "Electrical Contractor 92536"],
  },
  {
    logo: nsw,
    alt: "NSW Fair Trading",
    label: "NSW Contractor",
    lines: ["Licence 479925C"],
  },
  {
    logo: neca,
    alt: "NECA Member",
    label: "NECA Member",
    lines: [],
  },
  {
    logo: vcb,
    alt: "Veteran Community Business",
    label: "Veteran Community Business",
    lines: [],
  },
];

const CredentialsStrip = () => (
  <section className="bg-background py-10 px-6">
    <div className="container-main">
      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-7">
        Licensed &amp; Certified
      </p>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-7">
        {credentials.map((c, i) => (
          <ScrollReveal key={c.label} delay={i * 60}>
            <div className="flex flex-col items-center gap-2.5 text-center">
              <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden">
                <Image
                  src={c.logo}
                  alt={c.alt}
                  width={48}
                  height={48}
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-semibold leading-snug text-foreground">
                  {c.label}
                </div>
                {c.lines.map((line) => (
                  <div
                    key={line}
                    className="text-[10px] text-muted-foreground mt-0.5"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default CredentialsStrip;
