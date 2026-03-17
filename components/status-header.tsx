"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  { href: "/", label: "Overview" },
  { href: "/incidents", label: "Incidents" },
  { href: "/maintenance", label: "Maintenance" },
];

export function StatusHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a className="brand" href="https://keelapi.com">
          <span className="brand-badge">Keel</span>
          <span className="brand-copy">
            <span className="brand-title">Status</span>
            <span className="brand-subtitle">Operational visibility</span>
          </span>
        </a>
        <div className="site-header__actions">
          <nav className="nav" aria-label="Primary">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link${isActive ? " is-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
