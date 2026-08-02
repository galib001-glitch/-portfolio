"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

export default function MessagesInbox({ password }: { password: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch(`/api/admin/messages?password=${encodeURIComponent(password)}`);
      const json = await res.json();
      if (json.ok) setMessages(json.data);
      else setStatus(json.error);
    } catch {
      setStatus("Failed to load messages.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-white">Contact Messages</h3>
        <button onClick={load} className="text-xs text-neon-cyan">Refresh</button>
      </div>
      {status && <p className="text-xs text-white/40">{status}</p>}
      {messages.length === 0 ? (
        <p className="text-xs text-white/30">No messages yet.</p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs">
              <div className="flex justify-between text-white/40">
                <span>{m.name} · {m.email}</span>
                <span>{new Date(m.receivedAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-white/70">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
