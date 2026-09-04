import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#progress", label: "Progress" },
];

export default async function MarketingHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-sm border-b border-black/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="h-9 w-9 rounded-2xl bg-foreground flex items-center justify-center text-background font-semibold text-sm">
            M
          </span>
          <span className="text-sm font-semibold hidden sm:inline">MuseFit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-2 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <Link
              href="/dashboard"
              className="h-10 px-4 sm:px-5 rounded-full bg-cta text-background text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="h-10 px-3 sm:px-4 rounded-full text-sm font-medium text-foreground flex items-center hover:bg-black/[0.04] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="h-10 px-4 sm:px-5 rounded-full bg-cta text-background text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
