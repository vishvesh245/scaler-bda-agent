"use client";
import { useState } from "react";
import type { LeadProfile, PDFContent, PDFVariant } from "@/types";

interface Props {
  blobUrl: string;
  pdfContent: PDFContent;
  lead: LeadProfile;
  variant: PDFVariant;
  onSent: () => void;
}

const VARIANT_LABELS: Record<PDFVariant, string> = {
  senior: "Senior Track",
  switcher: "Career Transition",
  fresher: "Launch Track",
};

const VARIANT_COLORS: Record<PDFVariant, string> = {
  senior: "bg-yellow-100 text-yellow-800",
  switcher: "bg-cyan-100 text-cyan-800",
  fresher: "bg-red-100 text-red-800",
};

export function PDFPreview({ blobUrl, pdfContent, lead, variant, onSent }: Props) {
  const [approvalState, setApprovalState] = useState<"idle" | "editing" | "approved" | "skipped">("idle");
  const [coveringMessage, setCoveringMessage] = useState(
    `Hi ${lead.name}, great speaking with you today! I've put together a personalised overview just for you — it addresses the questions you raised and shows exactly how Scaler maps to your goals. Take a look when you get a chance, and I think you'll find the entrance test is worth your time.`
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendPDF(msg: string) {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blobUrl, lead, coveringMessage: msg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApprovalState("approved");
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send PDF");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* PDF metadata */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-xs font-medium px-2 py-1 rounded ${VARIANT_COLORS[variant]}`}>
          {VARIANT_LABELS[variant]}
        </span>
        <span className="text-xs text-gray-500">3 pages · personalised for {lead.name}</span>
        <div className="ml-auto flex items-center gap-3">
          <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#e94560] font-medium hover:underline"
          >
            Open PDF ↗
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi ${lead.name}, here's your personalised Scaler overview: ${blobUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-[#25D366] text-white font-medium px-2 py-1 rounded hover:bg-[#1ebe5d] transition"
          >
            Share via WhatsApp
          </a>
        </div>
      </div>

      {/* Blob URL for manual copy if WhatsApp delivery fails */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
        <span className="text-xs text-gray-400 shrink-0">PDF URL:</span>
        <span className="text-xs text-gray-600 font-mono truncate flex-1">{blobUrl}</span>
        <button
          onClick={() => navigator.clipboard.writeText(blobUrl)}
          className="text-xs text-[#e94560] font-medium hover:underline shrink-0"
        >
          Copy
        </button>
      </div>

      {/* PDF preview iframe */}
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
        <iframe
          src={blobUrl}
          className="w-full"
          style={{ height: "480px" }}
          title="PDF Preview"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Approval gate */}
      {approvalState === "idle" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-amber-800">
            Ready to send to {lead.name}? Review and approve before delivery.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => sendPDF(coveringMessage)}
              disabled={sending}
              className="flex-1 bg-[#e94560] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#d63555] transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "✓ Approve & Send"}
            </button>
            <button
              onClick={() => setApprovalState("editing")}
              className="flex-1 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              ✏ Edit message
            </button>
            <button
              onClick={() => setApprovalState("skipped")}
              className="px-4 bg-white border border-gray-200 text-gray-500 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {approvalState === "editing" && (
        <div className="bg-[#f8f8fc] border border-gray-200 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            WhatsApp covering message
          </label>
          <textarea
            value={coveringMessage}
            onChange={(e) => setCoveringMessage(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => sendPDF(coveringMessage)}
              disabled={sending}
              className="flex-1 bg-[#e94560] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#d63555] transition disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send →"}
            </button>
            <button
              onClick={() => setApprovalState("idle")}
              className="px-4 bg-white border border-gray-200 text-gray-600 text-sm py-2.5 rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {approvalState === "approved" && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm font-medium">
          <span>✓</span> PDF sent to {lead.name}&apos;s WhatsApp ({lead.leadWhatsApp})
        </div>
      )}

      {approvalState === "skipped" && (
        <div className="flex items-center gap-2 text-gray-600 bg-gray-100 rounded-xl px-4 py-3 text-sm">
          <span>—</span> Skipped. PDF was not sent.
        </div>
      )}
    </div>
  );
}
