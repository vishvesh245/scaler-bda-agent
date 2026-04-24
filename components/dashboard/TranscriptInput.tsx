"use client";
import { useState } from "react";

interface Props {
  transcript: string;
  onTranscriptChange: (t: string) => void;
  disabled?: boolean;
}

export function TranscriptInput({ transcript, onTranscriptChange, disabled }: Props) {
  const [mode, setMode] = useState<"text" | "audio">("text");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [audioError, setAudioError] = useState("");

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError("");
    setUploading(true);
    setUploadProgress("Uploading audio...");
    onTranscriptChange("");

    try {
      const form = new FormData();
      form.append("audio", file);

      setUploadProgress("Transcribing... (may take 30-60s for longer recordings)");
      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
      });
      const data = await transcribeRes.json();
      if (!transcribeRes.ok) throw new Error(data.error);

      onTranscriptChange(data.transcript);
      setUploadProgress("");
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "Transcription failed");
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("text")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            mode === "text"
              ? "bg-[#1a1a2e] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Paste transcript
        </button>
        <button
          onClick={() => setMode("audio")}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            mode === "audio"
              ? "bg-[#1a1a2e] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Upload audio
        </button>
      </div>

      {mode === "text" ? (
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste the call transcript here...&#10;&#10;BDA: Rohan, what's bringing you to Scaler?&#10;Rohan: I've been at TCS for 4 years..."
          disabled={disabled}
          rows={8}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50 resize-none font-mono"
        />
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-600">{uploadProgress}</p>
            </div>
          ) : transcript ? (
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Transcribed</span>
                <button
                  onClick={() => onTranscriptChange("")}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
              <p className="text-sm text-gray-700 line-clamp-4">{transcript}</p>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="space-y-2">
                <div className="text-3xl">🎙️</div>
                <p className="text-sm font-medium text-gray-700">Upload call recording</p>
                <p className="text-xs text-gray-400">MP3, WAV, M4A · Max ~5 minutes</p>
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
          )}
          {audioError && (
            <p className="text-sm text-red-600 mt-2">{audioError}</p>
          )}
        </div>
      )}
    </div>
  );
}
