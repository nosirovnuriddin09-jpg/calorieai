import { NextResponse, type NextRequest } from "next/server";
import { updateSession, ONBOARDING_COOKIE } from "@/lib/supabase/middleware";

// Routes that never require authentication — the marketing homepage plus
// the auth entry points themselves.
const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.some((p) => path === p || (p !== "/" && path.startsWith(`${p}/`)));

  // "/" needs no auth/session info at all — it's the marketing page and
  // stays visible to everyone regardless of auth/onboarding state. Skip
  // the Supabase round-trip entirely rather than paying for it and
  // discarding the result.
  if (path === "/") {
    return NextResponse.next();
  }

  const { supabase, supabaseResponse, user } = await updateSession(request);

  if (!user && !isPublicPath) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && !isPublicPath) {
    // Onboarding status is read from a cookie set once onboarding
    // finishes (see onboarding/actions.ts), not re-queried from Supabase
    // on every navigation — this used to be a second sequential DB call
    // on every single route change. It's a UX redirect, not a security
    // boundary: RLS + auth.uid() gate all real data regardless of this
    // cookie's value, so a stale/missing cookie only ever means an extra
    // (harmless) bounce through /onboarding, never unauthorized access.
    const onboardedCookie = request.cookies.get(ONBOARDING_COOKIE)?.value;

    if (onboardedCookie === "1" && path === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (onboardedCookie !== "1" && path !== "/onboarding") {
      // Cookie says "not onboarded" (or we've never set it, e.g. right
      // after signup on a different device) — confirm against Supabase
      // before redirecting, since this is the one path where being wrong
      // would incorrectly block a legitimate, onboarded user.
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        supabaseResponse.cookies.set(ONBOARDING_COOKIE, "1", {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
        });
      } else {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
