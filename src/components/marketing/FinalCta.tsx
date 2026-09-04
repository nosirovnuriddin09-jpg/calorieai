import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FinalCta() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="bg-foreground rounded-[32px] px-6 sm:px-12 py-14 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-background max-w-lg mx-auto">
          Start understanding your day.
        </h2>
        <p className="text-base text-background/70 mt-4 max-w-md mx-auto">
          Free to start. Takes less than a minute to set up.
        </p>
        <div className="flex items-center justify-center flex-wrap gap-3 mt-8">
          {user ? (
            <Link
              href="/dashboard"
              className="h-12 px-6 rounded-full bg-background text-foreground text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="h-12 px-6 rounded-full bg-background text-foreground text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
              >
                Create your account
              </Link>
              <Link
                href="/login"
                className="h-12 px-6 rounded-full text-sm font-medium text-background flex items-center hover:bg-white/10 transition-colors"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
