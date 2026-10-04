import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="font-display text-2xl font-semibold text-foreground">
            Explore <span className="text-primary">Sukawati</span>
          </Link>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Beranda</Link>
            <Link to="/admin" className="hover:text-primary">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-10 text-sm">
          <p className="font-display text-xl">Sukawati Tourism Hub</p>
          <p className="mt-2 opacity-80">Art • Culture • Craft • Culinary • Nature — Desa Sukawati, Gianyar, Bali</p>
        </div>
      </footer>
    </div>
  );
}
