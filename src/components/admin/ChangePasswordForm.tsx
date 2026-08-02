"use client";

import { useState } from "react";
import { FiKey } from "react-icons/fi";

export default function ChangePasswordForm({
  currentPassword,
  onChanged,
}: {
  currentPassword: string;
  onChanged: (newPassword: string) => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setStatus(null);
    if (newPassword.length < 6) {
      setStatus("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setStatus("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("Password changed. Use the new password next time you unlock the dashboard.");
        setNewPassword("");
        setConfirm("");
        onChanged(newPassword);
      } else {
        setStatus(json.error ?? "Failed to change password.");
      }
    } catch {
      setStatus("Network error while changing password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-5">
      <h3 className="font-display mb-3 flex items-center gap-2 text-base font-semibold text-white">
        <FiKey /> Change Admin Password
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
        />
      </div>
      <button
        onClick={submit}
        disabled={busy}
        className="mt-3 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-2 text-xs text-neon-blue hover:bg-neon-blue/20 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Update Password"}
      </button>
      {status && <p className="mt-3 text-xs text-white/50">{status}</p>}
    </div>
  );
}
