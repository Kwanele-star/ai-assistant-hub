// Frontend-only demo content generators. No backend, no external APIs.

export const RESPONSIBLE_AI_NOTICE =
  "Responsible AI: AI-generated content may contain errors or inaccuracies. Always review and verify information before using it for important workplace decisions or communication.";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type EmailInput = {
  recipient: string;
  subject: string;
  purpose: string;
  tone: "Formal" | "Friendly" | "Persuasive";
  length: "Short" | "Medium" | "Detailed";
};

const greetings: Record<EmailInput["tone"], string> = {
  Formal: "Dear",
  Friendly: "Hi",
  Persuasive: "Hello",
};

const openers: Record<EmailInput["tone"], string> = {
  Formal:
    "I hope this message finds you well. I am writing to you regarding the matter outlined below.",
  Friendly: "Hope you're having a good week! I wanted to reach out about something quick.",
  Persuasive:
    "I wanted to share something I believe is genuinely worth a few minutes of your time.",
};

const closers: Record<EmailInput["tone"], string> = {
  Formal: "Thank you for your time and consideration. I look forward to your response.\n\nKind regards,",
  Friendly: "Thanks so much — let me know what works for you!\n\nBest,",
  Persuasive:
    "I'd welcome the chance to discuss this further and show you the impact it can have.\n\nWarm regards,",
};

export function generateEmail(input: EmailInput): string {
  const name = input.recipient.trim() || "there";
  const purpose = input.purpose.trim();

  const body: string[] = [openers[input.tone], purpose];

  if (input.length !== "Short") {
    body.push(
      input.tone === "Persuasive"
        ? "Based on what we've seen so far, moving ahead on this would save time for the wider team and remove a recurring bottleneck in the current process."
        : "To make this as easy as possible, I'm happy to work around your schedule and share any background information you may need beforehand.",
    );
  }

  if (input.length === "Detailed") {
    body.push(
      "For context, here are the key points:\n\n• Objective — what we are trying to achieve and why it matters now.\n• Next step — a short conversation or written confirmation from your side.\n• Timeline — ideally within the coming week, though this is flexible.\n\nIf any of the above needs adjusting, please let me know and I will update accordingly.",
    );
  }

  return [
    `Subject: ${input.subject.trim() || "Quick note"}`,
    "",
    `${greetings[input.tone]} ${name},`,
    "",
    body.join("\n\n"),
    "",
    closers[input.tone],
    "[Your name]",
  ].join("\n");
}

export const EMAIL_PROMPTS = [
  { label: "Request a meeting", text: "Request a 30-minute meeting next week to review the quarterly plan." },
  { label: "Follow up on an application", text: "Politely follow up on a job application submitted two weeks ago." },
  { label: "Ask for assistance", text: "Ask a colleague for help finalising a report before Friday's deadline." },
  { label: "Apologise professionally", text: "Apologise for missing a scheduled call and propose a new time." },
  { label: "Send a project update", text: "Share a short progress update on the current project milestone." },
];

export type ResearchDepth = "Quick Summary" | "Detailed Summary" | "Key Insights" | "Recommendations";

export type ResearchResult = {
  summary: string;
  keyPoints: string;
  insights: string;
  recommendations: string;
};

export function generateResearch(topic: string, depth: ResearchDepth): ResearchResult {
  const t = topic.trim().replace(/\s+/g, " ").slice(0, 140) || "the selected topic";
  const detailed = depth === "Detailed Summary";

  return {
    summary: detailed
      ? `${t} is best understood as a practical shift rather than a single event. Across most organisations it changes three things at once: how work is planned, how information moves between teams, and how quality is checked before delivery. Early adopters report faster turnaround on routine work, while the harder gains — better decisions and fewer rework cycles — depend on how clearly responsibilities are defined.`
      : `${t} centres on improving how everyday work gets done. The core idea is to reduce manual, repetitive effort so that people can spend more time on judgement, relationships and higher-value decisions.`,
    keyPoints: [
      `• Scope — ${t} affects daily workflows more than it affects strategy documents.`,
      "• Adoption — teams succeed when a small pilot proves value before a wider rollout.",
      "• Quality — outputs still need human review; accuracy is a shared responsibility.",
      "• Skills — short, practical training beats long theoretical sessions.",
      "• Measurement — track time saved and error rates, not just usage counts.",
    ].join("\n"),
    insights: [
      "1. The bottleneck is rarely the tool — it is unclear ownership of the process it supports.",
      "2. Teams that document their prompts and templates get consistent results; ad-hoc use produces uneven quality.",
      "3. Benefits compound: small weekly savings on routine writing and research add up to meaningful capacity over a quarter.",
      "4. Trust grows fastest when people can see, edit and correct generated output rather than accept it blindly.",
    ].join("\n\n"),
    recommendations: [
      "• Start with one high-volume, low-risk workflow such as drafting routine emails or summarising documents.",
      "• Agree a simple review rule: every generated output is checked by the person who sends it.",
      "• Create a shared library of approved prompts and tone guidelines.",
      "• Review results after four weeks and decide whether to expand, adjust or stop.",
      "• Keep a short written policy covering confidentiality and appropriate use.",
    ].join("\n"),
  };
}

export const RESEARCH_PROMPTS = [
  "Summarise this topic for a beginner.",
  "Give me the key points from this article.",
  "What are the main recommendations?",
  "Explain the workplace impact of this topic.",
];

export const CHAT_PROMPTS = [
  "Help me plan my workday.",
  "Write a professional response to this message.",
  "Help me prepare for a meeting.",
  "Create a task list for my project.",
  "Improve this workplace message.",
];

const CHAT_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /plan.*day|workday|schedule/i,
    reply:
      "Here's a focused structure for your day:\n\n**Morning (deep work)**\n1. 60–90 minutes on your single most important task, notifications off.\n2. Short break, then clear urgent messages in one batch.\n\n**Midday (collaboration)**\n3. Meetings, reviews and anything needing other people.\n4. Quick note of decisions and owners while they're fresh.\n\n**Afternoon (finish and prepare)**\n5. Wrap up smaller tasks in a single block.\n6. Spend the last 10 minutes writing tomorrow's top three priorities.\n\nWould you like me to turn this into a checklist you can copy?",
  },
  {
    match: /respond|reply|response|message/i,
    reply:
      "Here's a professional reply you can adapt:\n\n\"Thank you for getting in touch and for setting out the details so clearly. I've reviewed your points and agree with the overall direction. I'll confirm the remaining items by end of day tomorrow, and I'll flag anything that might affect the timeline as soon as I know.\"\n\nIf you paste the original message, I can match its tone more precisely.",
  },
  {
    match: /meeting|prepare|agenda/i,
    reply:
      "A simple meeting prep framework:\n\n• **Outcome** — one sentence describing what success looks like.\n• **Agenda** — three items maximum, timed.\n• **Materials** — share anything that needs reading beforehand.\n• **Questions** — write the two questions you most need answered.\n• **Close** — end with decisions, owners and dates.\n\nTell me the meeting topic and I'll draft the agenda for you.",
  },
  {
    match: /task list|to-?do|project/i,
    reply:
      "Here's a starter task list:\n\n1. Define the goal and success measure.\n2. List deliverables and assign an owner to each.\n3. Break the first deliverable into steps under two hours.\n4. Set a mid-point check-in date.\n5. Identify one risk and a fallback plan.\n6. Agree how progress will be reported.\n\nShare your project name and deadline and I'll tailor this.",
  },
  {
    match: /improve|rewrite|polish|tone/i,
    reply:
      "I can tighten that up. A good workplace message usually:\n\n• Opens with the point, not the background.\n• Keeps paragraphs to two or three lines.\n• States clearly what you need and by when.\n• Ends politely without over-apologising.\n\nPaste the message and I'll return a polished version.",
  },
];

export function generateChatReply(message: string): string {
  const found = CHAT_REPLIES.find((r) => r.match.test(message));
  if (found) return found.reply;
  return `Good question. Here's how I'd approach "${message.trim().slice(0, 90)}":\n\n1. **Clarify the goal** — what should be true once this is done?\n2. **Gather what exists** — notes, prior work, anything reusable.\n3. **Draft quickly** — a rough version is easier to improve than a blank page.\n4. **Review and refine** — check accuracy, tone and length.\n5. **Share with context** — say what you need from the reader.\n\nIf you give me a bit more detail, I can draft the actual content for you.`;
}
