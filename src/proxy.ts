import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that never require authentication — the marketing homepage plus
// the auth entry points themselves.
const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, onboardingCompleted } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.some((p) => path === p || (p !== "/" && path.startsWith(`${p}/`)));

  if (!user && !isPublicPath) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // "/" stays visible to everyone regardless of auth/onboarding state — it's
  // the marketing page, not part of the app's protected/onboarding flow.
  if (user && onboardingCompleted === false && path !== "/onboarding" && !isPublicPath) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (user && onboardingCompleted === true && path === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
