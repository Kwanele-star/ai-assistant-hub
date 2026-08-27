import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, BookOpen, MessagesSquare, ArrowRight, PenLine, Sparkle, ShieldCheck } from "lucide-react";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { RESPONSIBLE_AI_NOTICE } from "@/lib/demo-ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Work smarter with AI" },
      {
        name: "description",
        content:
          "A clean AI productivity dashboard for professionals: draft emails, summarise research and chat with a workplace assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarise research and get workplace help from one simple AI dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn a rough idea into a polished, correctly-toned email in seconds.",
  },
  {
    to: "/research" as const,
    icon: BookOpen,
    title: "AI Research Assistant",
    description: "Summarise topics and articles into key points, insights and recommendations.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Workplace Chat",
    description: "Plan your day, prepare for meetings and sharpen everyday work messages.",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    { label: "Write an Email", icon: PenLine, to: "/email" as const },
    { label: "Summarise a Topic", icon: BookOpen, to: "/research" as const },
    { label: "Ask AI", icon: Sparkle, to: "/chat" as const },
  ];

  return (
    <AppLayout>
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-surface p-6 shadow-[var(--shadow-soft)] sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Sparkle className="size-3.5" /> Your AI workspace
        </span>
        <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Work smarter with AI</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your assistant for everyday workplace tasks — draft professional emails, research and
          summarise topics, and get practical help with planning, meetings and messages.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate({ to: "/email" })}>
            Write an email <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate({ to: "/chat" })}>
            Ask the assistant
          </Button>
        </div>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, description }) => (
          <article
            key={to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link to={to}>
                Open <ArrowRight />
              </Link>
            </Button>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Jump straight into the most common tasks.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickActions.map(({ label, icon: Icon, to }) => (
            <Button key={label} asChild variant="secondary" size="lg" className="rounded-xl">
              <Link to={to}>
                <Icon /> {label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <p className="mt-10 flex items-start gap-2 rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        {RESPONSIBLE_AI_NOTICE}
      </p>
    </AppLayout>
  );
}
