import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, LoadingState, OutputCard } from "@/components/output-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EMAIL_PROMPTS, delay, generateEmail } from "@/lib/demo-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content: "Generate professional workplace emails by tone and length, then edit, copy or regenerate them.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Draft formal, friendly or persuasive workplace emails in seconds." },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";
type Length = "Short" | "Medium" | "Detailed";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [length, setLength] = useState<Length>("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!purpose.trim()) {
      setError("Please describe the purpose or message of your email.");
      toast.error("Email purpose is required");
      return;
    }
    setError("");
    setLoading(true);
    await delay(900);
    setOutput(generateEmail({ recipient, subject, purpose, tone, length }));
    setLoading(false);
    toast.success("Email drafted — review before sending");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Smart Email Generator"
        subtitle="Describe what you need to say and the assistant will draft a professional email you can edit."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" placeholder="e.g. Sarah" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g. Meeting request" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="purpose">Email purpose / message</Label>
            <Textarea
              id="purpose"
              rows={5}
              placeholder="What should this email say?"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              aria-invalid={!!error}
            />
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length (optional)</Label>
              <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Detailed"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={run} disabled={loading}>
            <Wand2 /> {loading ? "Generating…" : "Generate Email"}
          </Button>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">Suggested prompts</h2>
          <p className="mt-1 text-xs text-muted-foreground">Tap one to fill the purpose field.</p>
          <div className="mt-4 flex flex-col gap-2">
            {EMAIL_PROMPTS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setPurpose(p.text); setError(""); }}
                className="rounded-xl border border-border px-4 py-3 text-left text-sm text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent"
              >
                {p.label}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingState label="Drafting your email…" />
        ) : output ? (
          <OutputCard
            title="Generated email"
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            onClear={() => setOutput("")}
            loading={loading}
          />
        ) : (
          <EmptyState
            icon={<Mail className="size-5" />}
            title="No email generated yet"
            description="Fill in the purpose of your email and press Generate Email to see a draft here."
          />
        )}
      </div>
    </AppLayout>
  );
}
