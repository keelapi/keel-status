import type { Metadata } from "next";
import "./globals.css";
import { StatusHeader } from "@/components/status-header";

export const metadata: Metadata = {
  title: "Keel Status",
  description: "Current operational status for Keel."
};

const themeBootstrapScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem("keel-theme");
      const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  })();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <div className="site-frame">
          <StatusHeader />
          <main className="shell site-main">{children}</main>
          <footer className="shell site-footer">
            <p>Operational reporting only. No telemetry is collected on this site.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
