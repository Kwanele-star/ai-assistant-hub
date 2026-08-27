import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { EmptyState, LoadingState, OutputCard } from "@/components/output-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RESEARCH_PROMPTS,
  delay,
  generateResearch,
  type ResearchDepth,
  type ResearchResult,
} from "@/lib/demo-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content: "Summarise topics and articles into a summary, key points, insights and recommendations you can edit.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Turn any topic or article into clear summaries, insights and next steps." },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS: ResearchDepth[] = ["Quick Summary", "Detailed Summary", "Key Insights", "Recommendations"];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<ResearchDepth>("Quick Summary");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or paste an article to research.");
      toast.error("A topic is required");
      return;
    }
    setError("");
    setLoading(true);
    await delay(1000);
    setResult(generateResearch(topic, depth));
    setLoading(false);
    toast.success("Research summarised — please verify the details");
  };

  const update = (key: keyof ResearchResult) => (v: string) =>
    setResult((r) => (r ? { ...r, [key]: v } : r));

  return (
    <AppLayout>
      <PageHeader
        title="AI Research Assistant"
        subtitle="Paste a topic or article and get a structured, editable breakdown you can use straight away."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic or article</Label>
          <Textarea
            id="topic"
            rows={6}
            placeholder="Paste an article or describe the topic you want to understand…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-invalid={!!error}
          />
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>

        <div className="mt-5">
          <Label>Output focus</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEPTHS.map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-all",
                  depth === d
                    ? "border-primary bg-gradient-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-accent",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <Button className="mt-6 w-full sm:w-auto" size="lg" onClick={run} disabled={loading}>
          <Search /> {loading ? "Researching…" : "Research & Summarise"}
        </Button>

        <div className="mt-6 border-t border-border pt-5">
          <h2 className="text-sm font-semibold text-foreground">Suggested research prompts</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {RESEARCH_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => { setTopic((t) => (t ? `${t}\n\n${p}` : p)); setError(""); }}
                className="rounded-full border border-border px-4 py-2 text-xs text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-6">
        {loading ? (
          <LoadingState label="Reading and summarising…" />
        ) : result ? (
          <>
            <OutputCard title="Summary" value={result.summary} onChange={update("summary")} onRegenerate={run} onClear={() => setResult(null)} rows={6} />
            <OutputCard title="Key points" value={result.keyPoints} onChange={update("keyPoints")} onRegenerate={run} onClear={() => setResult(null)} rows={7} />
            <OutputCard title="Insights" value={result.insights} onChange={update("insights")} onRegenerate={run} onClear={() => setResult(null)} rows={8} />
            <OutputCard title="Recommendations" value={result.recommendations} onChange={update("recommendations")} onRegenerate={run} onClear={() => setResult(null)} rows={7} />
          </>
        ) : (
          <EmptyState
            icon={<BookOpen className="size-5" />}
            title="Nothing researched yet"
            description="Enter a topic above and the assistant will return a summary, key points, insights and recommendations."
          />
        )}
      </div>
    </AppLayout>
  );
}
