"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bdaWhatsApp: phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("bda_number", phone);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1a1a2e] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#e94560] text-white text-xs font-bold tracking-widest px-3 py-1 rounded mb-4">
            SCALER BDA AGENT
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI-powered sales prep
          </h1>
          <p className="text-[#8888aa] text-sm">
            Walk into every call prepared. Follow up with PDFs that actually convert.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-1">Get started</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter the WhatsApp number where you want nudges and demo messages delivered.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp number (E.164 format)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Include country code. Example: +91 for India.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e94560] text-white font-semibold py-3 rounded-lg hover:bg-[#d63555] transition disabled:opacity-60"
            >
              {loading ? "Setting up..." : "Start →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Make sure this number has joined the Twilio WhatsApp Sandbox first.<br />
              Send <strong>join [keyword]</strong> to <strong>+1 415 523 8886</strong> on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
