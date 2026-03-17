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
        <span className="keel-header-brand">
          <a className="keel-header-brand__link" href="https://keelapi.com">
            <img className="keel-header-brand__icon" src="/keel.svg" alt="" aria-hidden="true" />
            <span className="keel-header-brand__wordmark">Keel</span>
          </a>
          <span className="keel-header-brand__copy">
            <span className="keel-header-brand__separator" aria-hidden="true">|</span>
            <span className="keel-header-brand__title">Status</span>
          </span>
        </span>
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
