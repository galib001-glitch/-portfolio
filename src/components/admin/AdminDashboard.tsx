"use client";

import { useState } from "react";
import { FiLock } from "react-icons/fi";
import ResumeUploader from "./ResumeUploader";
import LinkedinImporter from "./LinkedinImporter";
import PhotoUploader from "./PhotoUploader";
import MessagesInbox from "./MessagesInbox";
import ObjectEditor from "./ObjectEditor";
import ProfileEditor from "./ProfileEditor";
import SkillsEditor from "./SkillsEditor";
import ListEditor from "./ListEditor";
import ChangePasswordForm from "./ChangePasswordForm";
import type { Links } from "@/lib/types";
import {
  linksFields,
  educationFields,
  emptyEducation,
  experienceFields,
  emptyExperience,
  achievementFields,
  emptyAchievement,
  certificationFields,
  emptyCertification,
  researchFields,
  emptyResearch,
  manualProjectFields,
  emptyManualProject,
  collaborationFields,
  emptyCollaboration,
} from "./schemas";

export default function AdminDashboard({ links }: { links: Links }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function tryUnlock() {
    if (!password) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (json.ok) {
        setUnlocked(true);
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Network error while checking password.");
    } finally {
      setChecking(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm">
        <div className="glass-strong rounded-2xl border border-white/10 p-8 text-center">
          <FiLock className="mx-auto mb-4 text-neon-cyan" size={28} />
          <h2 className="font-display mb-2 text-lg font-semibold text-white">Admin Access</h2>
          <p className="mb-5 text-xs text-white/40">
            Enter the <code className="rounded bg-white/10 px-1.5 py-0.5">ADMIN_PASSWORD</code> configured for this
            site to manage content.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
            placeholder="Password"
            className="mb-4 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40"
          />
          <button
            onClick={tryUnlock}
            disabled={checking}
            className="w-full rounded-full border border-neon-blue/30 bg-neon-blue/10 py-2 text-sm text-neon-blue hover:bg-neon-blue/20 disabled:opacity-50"
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResumeUploader password={password} />
        <PhotoUploader password={password} />
      </div>
      <LinkedinImporter password={password} links={links} />
      <MessagesInbox password={password} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileEditor password={password} />
        <ObjectEditor contentKey="links" password={password} label="Links" fields={linksFields} />
      </div>

      <ChangePasswordForm currentPassword={password} onChanged={setPassword} />

      <SkillsEditor password={password} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ListEditor
          contentKey="education"
          password={password}
          label="Education"
          fields={educationFields}
          emptyItem={emptyEducation}
          titleKey="institution"
        />
        <ListEditor
          contentKey="experience"
          password={password}
          label="Experience"
          fields={experienceFields}
          emptyItem={emptyExperience}
          titleKey="role"
        />
        <ListEditor
          contentKey="achievements"
          password={password}
          label="Achievements & Activities"
          fields={achievementFields}
          emptyItem={emptyAchievement}
          titleKey="title"
        />
        <ListEditor
          contentKey="certifications"
          password={password}
          label="Certifications"
          fields={certificationFields}
          emptyItem={emptyCertification}
          titleKey="name"
        />
        <ListEditor
          contentKey="research"
          password={password}
          label="Research Papers"
          fields={researchFields}
          emptyItem={emptyResearch}
          titleKey="title"
        />
        <ListEditor
          contentKey="manual-projects"
          password={password}
          label="Projects"
          fields={manualProjectFields}
          emptyItem={emptyManualProject}
          titleKey="name"
        />
        <ListEditor
          contentKey="collaborations"
          password={password}
          label="Collaborations"
          fields={collaborationFields}
          emptyItem={emptyCollaboration}
          titleKey="title"
        />
      </div>
    </div>
  );
}
