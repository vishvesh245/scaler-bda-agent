"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LeadProfileForm } from "@/components/dashboard/LeadProfileForm";
import { NudgeFlow } from "@/components/dashboard/NudgeFlow";
import { PDFFlow } from "@/components/dashboard/PDFFlow";
import type { LeadProfile } from "@/types";

const EMPTY_LEAD: LeadProfile = {
  name: "", role: "", company: "", yoe: 0,
  intent: "", linkedinNotes: "", leadWhatsApp: "",
};

const SAMPLE_PERSONAS: LeadProfile[] = [
  {
    name: "Rohan Sharma",
    role: "SDE-2",
    company: "TCS",
    yoe: 4,
    intent: "want to switch to a product company, tired of service work, interested in AI engineering roles",
    linkedinNotes: "B.Tech CSE VIT Vellore '20, SDE-2 at TCS for 4 years (banking clients: HDFC, Citi), recent AWS Solutions Architect cert",
    leadWhatsApp: "",
  },
  {
    name: "Karthik Iyer",
    role: "Senior Software Engineer",
    company: "Google",
    yoe: 9,
    intent: "looking at AI engineering — what's your AI program like for someone like me?",
    linkedinNotes: "IIT Madras CS, 6 years at Google (Search infra), previously Microsoft, frequent open-source contributor",
    leadWhatsApp: "",
  },
  {
    name: "Meera Patel",
    role: "Final-year B.Tech student",
    company: "College",
    yoe: 0,
    intent: "need a job, family wants me to take the govt job offer but I want to work at a product company",
    linkedinNotes: "Tier-3 college, final year, government job offer through campus placement, no LinkedIn provided",
    leadWhatsApp: "",
  },
];

export default function DashboardPage() {
  const [lead, setLead] = useState<LeadProfile>(SAMPLE_PERSONAS[0]);
  const [activeTab, setActiveTab] = useState<"nudge" | "pdf">("nudge");
  const [bdaNumber, setBdaNumber] = useState("");
  const [bdaSaved, setBdaSaved] = useState(false);
  const bdaSavedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persona dropdown state
  const [search, setSearch] = useState(SAMPLE_PERSONAS[0].name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bda_number") || "";
    setBdaNumber(saved);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleBdaNumberChange(val: string) {
    setBdaNumber(val);
    localStorage.setItem("bda_number", val);
    if (bdaSavedTimer.current) clearTimeout(bdaSavedTimer.current);
    setBdaSaved(true);
    bdaSavedTimer.current = setTimeout(() => setBdaSaved(false), 1500);
  }

  function loadPersona(p: LeadProfile) {
    setLead({ ...p, leadWhatsApp: lead.leadWhatsApp });
    setSearch(p.name);
    setDropdownOpen(false);
  }

  function loadCustom() {
    setLead(EMPTY_LEAD);
    setSearch("");
    setDropdownOpen(false);
  }

  const filteredPersonas = SAMPLE_PERSONAS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayLabel = lead.name || "Select or search lead…";

  return (
    <div className="min-h-screen bg-[#f8f8fc]">
      {/* Header */}
      <div className="bg-[#1a1a2e] text-white px-6 py-3 flex items-center gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-80 transition">
          <span className="bg-[#e94560] text-xs font-bold tracking-widest px-2 py-1 rounded">
            SCALER BDA
          </span>
          <span className="font-semibold text-sm hidden sm:block">Sales Agent</span>
        </Link>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          {/* Persona searchable dropdown */}
          <div className="relative flex-1 max-w-xs" ref={dropdownRef}>
            <button
              onClick={() => { setDropdownOpen((o) => !o); setSearch(""); }}
              className="w-full flex items-center justify-between gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-3 py-2 text-sm text-white transition"
            >
              <span className={lead.name ? "text-white" : "text-white/50"}>
                {displayLabel}
              </span>
              <svg className="w-3.5 h-3.5 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name…"
                    className="w-full text-sm text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
                  />
                </div>
                <ul className="py-1 max-h-48 overflow-y-auto">
                  {filteredPersonas.map((p) => (
                    <li key={p.name}>
                      <button
                        onClick={() => loadPersona(p)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition ${
                          lead.name === p.name
                            ? "bg-[#1a1a2e] text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-2 text-xs opacity-60">{p.role} · {p.company}</span>
                      </button>
                    </li>
                  ))}
                  {filteredPersonas.length === 0 && (
                    <li className="px-4 py-2.5 text-sm text-gray-400">No match</li>
                  )}
                  <li>
                    <button
                      onClick={loadCustom}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#e94560] hover:bg-red-50 transition border-t border-gray-100"
                    >
                      + Custom lead
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* BDA WhatsApp */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/50 hidden md:block whitespace-nowrap">Your WA</span>
            <input
              type="tel"
              value={bdaNumber}
              onChange={(e) => handleBdaNumberChange(e.target.value)}
              placeholder="+91 98765 43210"
              className="text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent w-40"
            />
            {bdaNumber && (
              <span className={`text-xs font-medium transition-colors ${bdaSaved ? "text-yellow-300" : "text-green-400"}`}>
                {bdaSaved ? "Updated ✓" : "✓"}
              </span>
            )}
          </div>
        </div>

        {/* In-call CTA */}
        <a
          href="/in-call"
          target="_blank"
          className="shrink-0 flex items-center gap-1.5 bg-[#e94560] hover:bg-[#d63555] text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          In-call assist
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Lead profile */}
        <LeadProfileForm lead={lead} onChange={setLead} />

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("nudge")}
              className={`flex-1 text-sm font-medium py-3.5 transition ${
                activeTab === "nudge"
                  ? "text-[#1a1a2e] border-b-2 border-[#e94560] bg-white"
                  : "text-gray-500 hover:text-gray-700 bg-gray-50"
              }`}
            >
              Pre-call nudge
            </button>
            <button
              onClick={() => setActiveTab("pdf")}
              className={`flex-1 text-sm font-medium py-3.5 transition ${
                activeTab === "pdf"
                  ? "text-[#1a1a2e] border-b-2 border-[#e94560] bg-white"
                  : "text-gray-500 hover:text-gray-700 bg-gray-50"
              }`}
            >
              Post-call PDF
            </button>
          </div>
          <div className="p-5">
            {activeTab === "nudge" ? (
              <NudgeFlow lead={lead} bdaNumber={bdaNumber} />
            ) : (
              <PDFFlow lead={lead} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
