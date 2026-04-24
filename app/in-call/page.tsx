"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function InCallAssist() {
  const searchParams = useSearchParams();
  const leadName = searchParams.get("lead") || "";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: string }>>([]);

  async function askQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/in-call-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, leadName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnswer(data.answer);
      setHistory((prev) => [{ q: question, a: data.answer }, ...prev]);
      setQuestion("");
    } catch (err) {
      setAnswer("Error: " + (err instanceof Error ? err.message : "Failed to get answer"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-4 flex flex-col">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="text-center py-4 mb-4">
          <div className="inline-block bg-[#e94560] text-white text-xs font-bold tracking-widest px-2 py-1 rounded mb-2">
            IN-CALL ASSIST
          </div>
          {leadName && (
            <p className="text-[#8888aa] text-sm">Active call: <span className="text-white font-medium">{leadName}</span></p>
          )}
        </div>

        {/* Answer display */}
        {loading && (
          <div className="bg-[#2d2d4e] rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <p className="text-[#8888aa] text-sm">Looking up...</p>
          </div>
        )}

        {answer && !loading && (
          <div className="bg-white rounded-xl p-4 mb-4">
            <p className="text-xs text-[#e94560] font-bold tracking-wider mb-2">ANSWER</p>
            <p className="text-sm text-gray-800 leading-relaxed">{answer}</p>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="space-y-2 mb-4">
            {history.slice(1).map((item, i) => (
              <div key={i} className="bg-[#2d2d4e] rounded-xl p-3">
                <p className="text-xs text-[#8888aa] mb-1 line-clamp-1">Q: {item.q}</p>
                <p className="text-xs text-white line-clamp-2">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-auto">
          <form onSubmit={askQuestion} className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a curriculum question..."
              className="flex-1 bg-[#2d2d4e] text-white placeholder-[#6666aa] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560]"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-[#e94560] text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-50 transition hover:bg-[#d63555]"
            >
              →
            </button>
          </form>
          <p className="text-center text-xs text-[#444466] mt-3">
            Answers grounded in Scaler curriculum. Bookmark this page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InCallPage() {
  return (
    <Suspense>
      <InCallAssist />
    </Suspense>
  );
}
