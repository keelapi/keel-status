import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keel Status",
  description: "Current operational status for Keel."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="site-header">
            <div>
              <Link className="brand" href="/">
                Keel Status
              </Link>
              <p className="subtle">Operational visibility for status.keelapi.com</p>
            </div>
            <nav className="nav">
              <Link href="/">Overview</Link>
              <Link href="/incidents">Incidents</Link>
              <Link href="/maintenance">Maintenance</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>Plain operational reporting. No telemetry is collected on this site.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
