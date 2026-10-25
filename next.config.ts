import type { NextConfig } from "next";

const supabaseUrl = (() => { try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin; } catch { return ""; } })();
const supabaseWs = supabaseUrl.replace(/^https:/, "wss:");
const esDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: limita desde dónde puede cargar código y datos la página,
// lo que frena la mayoría de los ataques XSS y la exfiltración de datos.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${supabaseUrl} ${supabaseWs}`.trim(),
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const cabecerasSeguridad = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: cabecerasSeguridad },
      // Datos de pacientes: nunca en caché del navegador ni de intermediarios
      ...["/paciente/:path*", "/admin/:path*", "/mfa", "/login", "/api/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      })),
    ];
  },
};

export default nextConfig;
