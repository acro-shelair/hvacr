"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, Send } from "lucide-react";

const textFields = [
  { label: "Full Name", name: "name" as const, type: "text" },
  { label: "Email Address", name: "email" as const, type: "email" },
  { label: "Phone Number", name: "phone" as const, type: "tel" },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General Enquiry",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card-elevated text-center py-16">
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="font-display font-bold text-charcoal text-2xl mb-2">Thank You!</h3>
        <p className="text-muted-foreground font-body">
          We&apos;ve received your enquiry and will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {textFields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block font-body font-medium text-charcoal text-sm mb-1.5">
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            required={field.name !== "phone"}
            autoComplete={field.name === "email" ? "email" : field.name === "phone" ? "tel" : "name"}
            inputMode={field.name === "phone" ? "tel" : field.name === "email" ? "email" : undefined}
            value={form[field.name]}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
            className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
          />
        </div>
      ))}

      <div>
        <label htmlFor="enquiry-type" className="block font-body font-medium text-charcoal text-sm mb-1.5">Enquiry Type</label>
        <select
          id="enquiry-type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
        >
          <option>General Enquiry</option>
          <option>Refrigeration</option>
          <option>Air Conditioning</option>
          <option>Cold Room Hire</option>
          <option>Maintenance & Service</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block font-body font-medium text-charcoal text-sm mb-1.5">Message</label>
        <textarea
          id="message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card resize-none"
        />
      </div>

      <button type="submit" className="btn-primary gap-2 w-full sm:w-auto">
        <Send className="w-4 h-4" /> Send Enquiry
      </button>
    </form>
  );
}
