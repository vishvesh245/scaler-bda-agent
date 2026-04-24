import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";


export const COLORS = {
  navy: "#1A1A2E",
  navyLight: "#2D2D4E",
  red: "#E94560",
  gold: "#C9A84C",
  teal: "#00B4D8",
  white: "#FFFFFF",
  offWhite: "#F8F8FC",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  text: "#1F2937",
};

// Pre-created style sheets for each variant — StyleSheet.create must be called at module level
function buildStyles(accent: string) {
  return StyleSheet.create({
    page: { backgroundColor: COLORS.white, paddingBottom: 0 },
    header: { backgroundColor: COLORS.navy, paddingTop: 28, paddingRight: 36, paddingBottom: 24, paddingLeft: 36 },
    headerSub: { backgroundColor: COLORS.navy, paddingTop: 18, paddingRight: 36, paddingBottom: 16, paddingLeft: 36 },
    headerBrand: { fontSize: 11, color: accent, fontWeight: 700, marginBottom: 10 },
    headerBrandNoMargin: { fontSize: 11, color: accent, fontWeight: 700, marginBottom: 0 },
    headline: { fontSize: 22, color: COLORS.white, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 },
    subheadline: { fontSize: 12, color: "#C4C4D4", fontWeight: 400, lineHeight: 1.5 },
    body: { paddingTop: 24, paddingRight: 36, paddingBottom: 50, paddingLeft: 36 },
    bodyLast: { paddingTop: 24, paddingRight: 36, paddingBottom: 24, paddingLeft: 36 },
    sectionTitle: { fontSize: 10, fontWeight: 700, color: accent, marginBottom: 10, marginTop: 20 },
    paragraph: { fontSize: 11, color: COLORS.text, lineHeight: 1.6, marginBottom: 8 },
    card: { backgroundColor: COLORS.offWhite, borderRadius: 6, paddingTop: 12, paddingRight: 14, paddingBottom: 12, paddingLeft: 14, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: accent },
    cardTitle: { fontSize: 11, fontWeight: 700, color: COLORS.navy, marginBottom: 4 },
    cardTitleSmall: { fontSize: 10, fontWeight: 700, color: COLORS.navy, marginBottom: 4 },
    cardTitleAccent: { fontSize: 9, fontWeight: 700, color: accent },
    cardBody: { fontSize: 10, color: COLORS.text, lineHeight: 1.5 },
    cardBodyGray: { fontSize: 10, color: COLORS.gray, lineHeight: 1.5 },
    qaRow: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
    question: { fontSize: 10, fontWeight: 700, color: COLORS.navy, marginBottom: 4 },
    answer: { fontSize: 10, color: COLORS.text, lineHeight: 1.55 },
    footer: { backgroundColor: COLORS.navy, paddingTop: 10, paddingRight: 36, paddingBottom: 10, paddingLeft: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0 },
    footerText: { fontSize: 9, color: "#8888AA" },
    accentDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: accent, marginRight: 6 },
    row: { flexDirection: "row", alignItems: "center" },
    chip: { backgroundColor: accent, borderRadius: 4, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, marginRight: 6, marginBottom: 4 },
    chipText: { fontSize: 9, color: COLORS.white, fontWeight: 600 },
    divider: { height: 1, backgroundColor: COLORS.lightGray, marginTop: 12, marginBottom: 12 },
    statBox: { flex: 1, backgroundColor: COLORS.offWhite, borderRadius: 6, padding: 10, borderLeftWidth: 3, borderLeftColor: accent },
    statValue: { fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 4 },
    statLabel: { fontSize: 9, color: COLORS.gray },
  });
}

export const STYLES_GOLD = buildStyles(COLORS.gold);
export const STYLES_TEAL = buildStyles(COLORS.teal);
export const STYLES_RED = buildStyles(COLORS.red);

interface HeaderProps {
  headline: string;
  subheadline: string;
  s: ReturnType<typeof buildStyles>;
  programBadge: string;
}

export function PDFHeader({ headline, subheadline, s, programBadge }: HeaderProps) {
  return (
    <View style={s.header}>
      <Text style={s.headerBrand}>SCALER · {programBadge}</Text>
      <Text style={s.headline}>{headline}</Text>
      <Text style={s.subheadline}>{subheadline}</Text>
    </View>
  );
}

interface FooterProps {
  s: ReturnType<typeof buildStyles>;
}

export function PDFFooter({ s }: FooterProps) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>scaler.com · Prepared exclusively for you</Text>
    </View>
  );
}
