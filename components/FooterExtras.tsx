"use client";
import { useState } from "react";

const TOOLS = [
  { name: "Kwizzo",       url: "https://kwizzo.app",        desc: "Family quiz game" },
  { name: "Tutiq",        url: "https://tutiq.app",         desc: "AI personal tutor" },
  { name: "QuizBites",    url: "https://quizbites.app",     desc: "Live classroom quiz" },
  { name: "ResumeVault",  url: "https://resumevault.app",   desc: "AI resume builder" },
  { name: "WanderAI",     url: "https://ai-travel-planner-vert.vercel.app", desc: "AI travel planner" },
  { name: "WealthPilot",  url: "https://ai-investment-tracker-delta.vercel.app", desc: "Investment tracker" },
  { name: "SpeakFast",    url: "https://language-learning-bot-blue.vercel.app", desc: "Language learning" },
  { name: "ComplyScan",   url: "https://complybuddy-y3lj4k0nv-infosivas-projects.vercel.app", desc: "Compliance scanner" },
];

// Sign up free at formspree.io and replace this with your form ID
const FORMSPREE_ID = "xkgjqpob";

export default function FooterExtras() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="border-t border-white/[0.06] pt-8 mt-2">
      {/* More AI Tools */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-4">More AI Tools</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {TOOLS.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/90 text-sm transition-colors"
              title={t.desc}
            >
              {t.name}
            </a>
          ))}
        </div>
      </div>

      {/* Email capture */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Get updates on new tools</p>
        {status === "done" ? (
          <p className="text-emerald-400 text-sm">You&apos;re in! We&apos;ll let you know when something new launches.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "..." : "Notify me"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
        )}
      </div>
    </div>
  );
}
