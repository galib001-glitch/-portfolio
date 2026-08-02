"use client";

import { useEffect, useState } from "react";

export default function TypingRoles({ roles }: { roles: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    const speed = deleting ? 35 : 65;
    const pauseAtFull = 1400;
    const pauseAtEmpty = 300;

    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseAtFull);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, pauseAtEmpty);
    } else {
      timeout = setTimeout(() => {
        setText((t) => (deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)));
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles]);

  return (
    <span className="font-mono-term text-neon-cyan">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-neon-cyan align-middle" />
    </span>
  );
}
