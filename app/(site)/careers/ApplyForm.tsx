"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import { submitJobApplication } from "./actions";

type Props = {
  open: boolean;
  onClose: () => void;
  jobPostingId?: string | null;
  defaultPosition?: string;
};

const MAX_FILES = 3;
const MAX_MB = 5;
const ACCEPT = ".pdf,.doc,.docx";

export default function ApplyForm({
  open,
  onClose,
  jobPostingId,
  defaultPosition,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: defaultPosition ?? "",
    message: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function reset() {
    setSubmitted(false);
    setError(null);
    setFiles([]);
    setForm({
      name: "",
      email: "",
      phone: "",
      position: defaultPosition ?? "",
      message: "",
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    if (loading) return;
    reset();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("email", form.email);
    fd.set("phone", form.phone);
    fd.set("position", form.position);
    fd.set("message", form.message);
    if (jobPostingId) fd.set("job_posting_id", jobPostingId);
    for (const file of files) fd.append("documents", file);

    const result = await submitJobApplication({}, fd);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
            <h3 className="font-display font-bold text-charcoal text-xl sm:text-2xl mb-2">
              Application Received!
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-6">
              Thanks for applying. Our team will review your application and be
              in touch shortly.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display font-bold text-charcoal text-xl sm:text-2xl mb-1 pr-8">
              Apply{form.position ? ` for ${form.position}` : ""}
            </h3>
            <p className="text-muted-foreground font-body text-sm mb-5">
              Fill in your details and attach your resume or cover letter.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="apply-name"
                  className="block font-body font-medium text-charcoal text-sm mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="apply-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-email"
                  className="block font-body font-medium text-charcoal text-sm mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="apply-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-phone"
                  className="block font-body font-medium text-charcoal text-sm mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="apply-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-position"
                  className="block font-body font-medium text-charcoal text-sm mb-1.5"
                >
                  Position
                </label>
                <input
                  id="apply-position"
                  type="text"
                  required
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="e.g. Refrigeration Technician"
                  className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-message"
                  className="block font-body font-medium text-charcoal text-sm mb-1.5"
                >
                  Cover Letter / Message
                </label>
                <textarea
                  id="apply-message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full border border-input rounded-lg px-4 py-3 text-base sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-card resize-none"
                />
              </div>

              <div>
                <label className="block font-body font-medium text-charcoal text-sm mb-1.5">
                  Documents{" "}
                  <span className="text-muted-foreground font-normal">
                    (PDF, DOC, DOCX · up to {MAX_FILES} files · {MAX_MB}MB each)
                  </span>
                </label>

                {files.length < MAX_FILES && (
                  <label className="flex items-center justify-center gap-2 border border-dashed border-input rounded-lg px-4 py-3 text-sm text-muted-foreground cursor-pointer hover:border-accent hover:text-accent transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Attach files</span>
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      accept={ACCEPT}
                      onChange={handleFilePick}
                      className="hidden"
                    />
                  </label>
                )}

                {files.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {files.map((file, i) => (
                      <li
                        key={`${file.name}-${i}`}
                        className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          disabled={loading}
                          className="text-muted-foreground hover:text-destructive disabled:opacity-40"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary gap-2 w-full disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Application
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
