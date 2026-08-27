import { Check, Copy, Eraser, RefreshCw, Pencil, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  loading?: boolean;
  rows?: number;
};

export function OutputCard({ title, value, onChange, onRegenerate, onClear, loading, rows = 14 }: Props) {
  const [editing, setEditing] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed — select the text and copy manually");
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? <Lock /> : <Pencil />}
            {editing ? "Lock" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check /> : <Copy />}
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className={cn(loading && "animate-spin")} />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Eraser />
            Clear
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        readOnly={!editing}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-4 resize-y rounded-xl bg-background text-sm leading-relaxed",
          !editing && "opacity-90",
        )}
      />
    </section>
  );
}

export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <RefreshCw className="size-4 animate-spin text-primary" />
        {label}
      </p>
      <div className="mt-5 space-y-3">
        {[100, 92, 78, 96, 64].map((w, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-full bg-muted"
            style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
