import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppLayout, PageHeader } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHAT_PROMPTS, delay, generateChatReply } from "@/lib/demo-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat | AI Workplace Assistant" },
      {
        name: "description",
        content: "Chat with a workplace productivity assistant to plan your day, prepare meetings and improve messages.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      { property: "og:description", content: "A workplace productivity chat assistant for planning, meetings and messages." },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: number; role: "user" | "assistant"; text: string };

const WELCOME: Msg = {
  id: 0,
  role: "assistant",
  text: "Hello! I'm your workplace productivity assistant. I can help you plan your day, prepare for meetings, build task lists and polish professional messages. What are you working on?",
};

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value) {
      toast.error("Type a message first");
      return;
    }
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: value }]);
    setInput("");
    setTyping(true);
    await delay(850);
    setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: generateChatReply(value) }]);
    setTyping(false);
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Workplace Chat"
        subtitle="Ask anything about planning, meetings, task lists or professional writing."
      />

      <section className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Bot className="size-4 text-primary-foreground" />
            </span>
            Workplace Assistant
          </span>
          <Button variant="ghost" size="sm" onClick={() => { setMessages([WELCOME]); toast.success("Conversation cleared"); }}>
            <Trash2 /> Clear
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Bot className="size-4" />
                </span>
              )}
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-300 sm:max-w-[75%]",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <User className="size-4" />
                </span>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Bot className="size-4" />
              </span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3 sm:p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {CHAT_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              placeholder="Message your assistant…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              className="max-h-32 min-h-11 resize-none rounded-xl"
            />
            <Button size="icon" className="size-11 shrink-0 rounded-xl" onClick={() => void send(input)} disabled={typing} aria-label="Send message">
              <Send />
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
