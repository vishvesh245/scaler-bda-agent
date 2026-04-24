"use client";
import { useState } from "react";
import type { LeadProfile } from "@/types";

interface Props {
  lead: LeadProfile;
  bdaNumber: string;
}

export function NudgeFlow({ lead, bdaNumber }: Props) {
  const [nudgeCache, setNudgeCache] = useState<Record<string, string>>({});
  const nudgeText = nudgeCache[lead.name] ?? "";
  const setNudgeText = (text: string) =>
    setNudgeCache((prev) => ({ ...prev, [lead.name]: text }));
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function generateNudge() {
    if (!lead.name || !lead.role) {
      setError("Please fill in the lead profile first.");
      return;
    }
    setError("");
    setGenerating(true);
    setSent(false);
    try {
      const res = await fetch("/api/generate-nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNudgeText(data.nudgeText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate nudge");
    } finally {
      setGenerating(false);
    }
  }

  async function sendNudge() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/send-nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nudgeText, bdaNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send nudge");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#1a1a2e]">Pre-call BDA nudge</h3>
          <p className="text-sm text-gray-500">Sent directly to the BDA — no approval needed.</p>
        </div>
        <button
          onClick={generateNudge}
          disabled={generating}
          className="bg-[#1a1a2e] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2d2d4e] transition disabled:opacity-60"
        >
          {generating ? "Generating..." : "Generate nudge"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {nudgeText && (
        <div className="space-y-3">
          <div className="bg-[#f8f8fc] rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-[#1a1a2e] text-white px-2 py-0.5 rounded font-medium">WhatsApp preview</span>
              <span className="text-xs text-gray-400">→ BDA</span>
            </div>
            <textarea
              value={nudgeText}
              onChange={(e) => setNudgeText(e.target.value)}
              rows={10}
              className="w-full bg-transparent text-sm text-gray-800 resize-none focus:outline-none leading-relaxed font-mono"
            />
          </div>

          {sent ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg px-4 py-3 text-sm font-medium">
              <span>✓</span> Nudge sent to BDA&apos;s WhatsApp
            </div>
          ) : (
            <button
              onClick={sendNudge}
              disabled={sending}
              className="w-full bg-[#e94560] text-white font-semibold py-3 rounded-lg hover:bg-[#d63555] transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send to BDA →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
