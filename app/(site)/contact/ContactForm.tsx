"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, Send, AlertCircle, Loader2 } from "lucide-react";
import { submitContactForm } from "./actions";

const textFields = [
  { label: "Full Name", name: "name" as const, type: "text" },
  { label: "Email Address", name: "email" as const, type: "email" },
  { label: "Phone Number", name: "phone" as const, type: "tel" },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General Enquiry",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("email", form.email);
    fd.set("phone", form.phone);
    fd.set("enquiry_type", form.type);
    fd.set("message", form.message);

    const result = await submitContactForm({}, fd);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card-elevated text-center py-16">
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="font-display font-bold text-charcoal text-2xl mb-2">
          Thank You!
        </h3>
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
          <label
            htmlFor={field.name}
            className="block font-body font-medium text-charcoal text-sm mb-1.5"
          >
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            required={field.name !== "phone"}
            autoComplete={
              field.name === "email"
                ? "email"
                : field.name === "phone"
                ? "tel"
                : "name"
            }
            inputMode={
              field.name === "phone"
                ? "tel"
                : field.name === "email"
                ? "email"
                : undefined
            }
            value={form[field.name]}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
            className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
          />
        </div>
      ))}

      <div>
        <label
          htmlFor="enquiry-type"
          className="block font-body font-medium text-charcoal text-sm mb-1.5"
        >
          Enquiry Type
        </label>
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
          <option>Maintenance &amp; Service</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-body font-medium text-charcoal text-sm mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary gap-2 w-full sm:w-auto disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Send Enquiry
          </>
        )}
      </button>
    </form>
  );
}
