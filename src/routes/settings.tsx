import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESPONSIBLE_AI_NOTICE } from "@/lib/demo-ai";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Assistant" },
      { name: "description", content: "Adjust default tone, output length and assistant preferences for your AI workspace." },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      { property: "og:description", content: "Set default tone, length and workspace preferences." },
    ],
  }),
  component: SettingsPage,
});

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5 last:border-0">
      <div className="max-w-md">
        <Label className="text-sm font-semibold text-foreground">{title}</Label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");
  const [prompts, setPrompts] = useState(true);
  const [notice, setNotice] = useState(true);

  const saved = () => toast.success("Preference saved");

  return (
    <AppLayout>
      <PageHeader title="Settings" subtitle="Preferences for how the assistant drafts and presents content." />

      <section className="rounded-2xl border border-border bg-card px-5 shadow-[var(--shadow-soft)] sm:px-6">
        <Row title="Default tone" description="Used as the starting tone in the Smart Email Generator.">
          <Select value={tone} onValueChange={(v) => { setTone(v); saved(); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Formal", "Friendly", "Persuasive"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        <Row title="Default length" description="How much detail generated content should include by default.">
          <Select value={length} onValueChange={(v) => { setLength(v); saved(); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Short", "Medium", "Detailed"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        <Row title="Show suggested prompts" description="Display example prompts on the email, research and chat pages.">
          <Switch checked={prompts} onCheckedChange={(v) => { setPrompts(v); saved(); }} />
        </Row>
        <Row title="Show Responsible AI notice" description="Keep the review-before-use reminder visible across the app.">
          <Switch checked={notice} onCheckedChange={(v) => { setNotice(v); saved(); }} />
        </Row>
      </section>

      <p className="mt-8 flex items-start gap-2 rounded-xl border border-border bg-accent/50 p-4 text-xs leading-relaxed text-accent-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        {RESPONSIBLE_AI_NOTICE}
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        This is a frontend-only demo experience. No account, database or backend is used, and preferences are
        not stored between sessions.
      </p>
    </AppLayout>
  );
}
