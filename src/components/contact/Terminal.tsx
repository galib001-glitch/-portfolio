"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile, Links } from "@/lib/types";

interface Line {
  type: "input" | "output" | "system";
  text: string;
}

const HELP = [
  "Available commands:",
  "  whoami        show a short bio",
  "  contact       start the guided contact form",
  "  socials       list social & professional links",
  "  clear         clear the terminal",
  "  help          show this message",
];

type Stage = "idle" | "name" | "email" | "message" | "confirm" | "sending" | "sent";

export default function Terminal({ profile, links }: { profile: Profile; links: Links }) {
  const [lines, setLines] = useState<Line[]>([
    { type: "system", text: `Galib // Contact Terminal v1.0` },
    { type: "system", text: `Type 'help' to see available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [draft, setDraft] = useState({ name: "", email: "", message: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  function push(...newLines: Line[]) {
    setLines((l) => [...l, ...newLines]);
  }

  async function submit(finalDraft: typeof draft) {
    setStage("sending");
    push({ type: "output", text: "Sending message…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDraft),
      });
      if (res.ok) {
        push({ type: "output", text: "Message received. Thank you — I will get back to you soon." });
      } else {
        push({ type: "output", text: "Something went wrong sending the message. Please try again later." });
      }
    } catch {
      push({ type: "output", text: "Network error — please try again later." });
    } finally {
      setStage("sent");
    }
  }

  function handleCommand(raw: string) {
    const cmd = raw.trim();
    push({ type: "input", text: cmd });

    if (stage === "name") {
      setDraft((d) => ({ ...d, name: cmd }));
      push({ type: "output", text: `Nice to meet you, ${cmd}. What's your email?` });
      setStage("email");
      return;
    }
    if (stage === "email") {
      setDraft((d) => ({ ...d, email: cmd }));
      push({ type: "output", text: "Got it. What would you like to say?" });
      setStage("message");
      return;
    }
    if (stage === "message") {
      const finalDraft = { ...draft, message: cmd };
      setDraft(finalDraft);
      push({ type: "output", text: `Send this message as ${finalDraft.name} <${finalDraft.email}>? (y/n)` });
      setStage("confirm");
      return;
    }
    if (stage === "confirm") {
      if (/^y(es)?$/i.test(cmd)) {
        submit(draft);
      } else {
        push({ type: "output", text: "Cancelled. Type 'contact' to start over." });
        setStage("idle");
      }
      return;
    }

    switch (cmd.toLowerCase()) {
      case "help":
        push(...HELP.map((t) => ({ type: "output" as const, text: t })));
        break;
      case "whoami":
        push({ type: "output", text: profile.bio });
        break;
      case "socials":
        push(
          { type: "output", text: `GitHub    ${links.github}` },
          { type: "output", text: `LinkedIn  ${links.linkedin}` },
          { type: "output", text: `Email     ${profile.email}` }
        );
        break;
      case "contact":
        push({ type: "output", text: "Starting guided contact form. What's your name?" });
        setStage("name");
        break;
      case "clear":
        setLines([]);
        break;
      case "":
        break;
      default:
        push({ type: "output", text: `Command not found: ${cmd}. Type 'help' for options.` });
    }
  }

  return (
    <div
      className="glass-strong mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <span className="h-3 w-3 rounded-full bg-green-400/70" />
        <span className="font-mono-term ml-3 text-xs text-white/40">galib@portfolio: ~/contact</span>
      </div>
      <div ref={scrollRef} className="font-mono-term h-80 overflow-y-auto p-5 text-sm">
        {lines.map((l, i) => (
          <div key={i} className={l.type === "input" ? "text-white" : l.type === "system" ? "text-neon-purple" : "text-white/60"}>
            {l.type === "input" ? <span className="text-neon-cyan">$ </span> : null}
            {l.text}
          </div>
        ))}
        {stage !== "sending" && stage !== "sent" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(input);
              setInput("");
            }}
            className="mt-1 flex items-center gap-2"
          >
            <span className="text-neon-cyan">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              spellCheck={false}
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/20"
              placeholder="type a command…"
            />
          </form>
        )}
      </div>
    </div>
  );
}
