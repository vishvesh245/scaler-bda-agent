import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@react-pdf/renderer",
    "@react-pdf/pdfkit",
    "@react-pdf/image",
    "@react-pdf/font",
    "@react-pdf/layout",
    "@react-pdf/render",
    "@react-pdf/reconciler",
    "@react-pdf/stylesheet",
    "@react-pdf/fns",
    "@react-pdf/textkit",
    "@react-pdf/svg",
    "@react-pdf/primitives",
    "@react-pdf/types",
  ],
};

export default nextConfig;
