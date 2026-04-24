"use client";
import type { LeadProfile } from "@/types";

interface Props {
  lead: LeadProfile;
  onChange: (lead: LeadProfile) => void;
  disabled?: boolean;
}

export function LeadProfileForm({ lead, onChange, disabled }: Props) {
  function update(field: keyof LeadProfile, value: string | number) {
    onChange({ ...lead, [field]: value });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-semibold text-[#1a1a2e] uppercase tracking-wider">
        Lead Profile
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
          <input
            value={lead.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Rohan Sharma"
            disabled={disabled}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Years of Experience *</label>
          <input
            type="number"
            value={lead.yoe}
            onChange={(e) => update("yoe", parseInt(e.target.value) || 0)}
            min={0}
            max={30}
            disabled={disabled}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Current Role *</label>
          <input
            value={lead.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="Software Engineer"
            disabled={disabled}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Company *</label>
          <input
            value={lead.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="TCS"
            disabled={disabled}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Stated Intent *</label>
        <input
          value={lead.intent}
          onChange={(e) => update("intent", e.target.value)}
          placeholder="Want to switch to a product company, interested in AI engineering roles"
          disabled={disabled}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn / Notes</label>
        <textarea
          value={lead.linkedinNotes}
          onChange={(e) => update("linkedinNotes", e.target.value)}
          placeholder="B.Tech CSE VIT Vellore '20, SDE-2 at TCS for 4 years (banking clients: HDFC, Citi), recent AWS cert..."
          disabled={disabled}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Lead&apos;s WhatsApp Number</label>
        <input
          value={lead.leadWhatsApp}
          onChange={(e) => update("leadWhatsApp", e.target.value)}
          placeholder="+919876543210"
          disabled={disabled}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560] disabled:bg-gray-50"
        />
        <p className="text-xs text-gray-400 mt-1">Where the personalised PDF will be sent after approval.</p>
      </div>
    </div>
  );
}
