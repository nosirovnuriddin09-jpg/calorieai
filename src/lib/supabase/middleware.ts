import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const ONBOARDING_COOKIE = "mf_onboarded";

// Headers middleware sets on the request it forwards to page/route
// handlers, carrying the already-verified user identity. These are only
// ever written here, after auth.getUser() has verified the session — a
// client cannot inject its own value under these names because
// NextRequest.headers.set() below mutates the single request object that
// continues on to the page; nothing merges in whatever the client sent
// under the same header name. See getVerifiedUser() in
// lib/supabase/server.ts for the consuming side.
export const VERIFIED_USER_ID_HEADER = "x-mf-verified-user-id";
export const VERIFIED_USER_EMAIL_HEADER = "x-mf-verified-user-email";

/**
 * Refreshes the auth session, verifies the user, and stamps the verified
 * identity onto the request's headers so the downstream page/route
 * handler can trust it without repeating the auth.getUser() network
 * round-trip. This is the real security boundary — auth.getUser() always
 * talks to Supabase (no shortcut here, since forging a session is
 * exactly what this prevents) and runs on every protected-route request.
 *
 * It deliberately does NOT also look up onboarding_completed: that used
 * to be a second sequential Supabase round-trip on every single
 * navigation, even for fully-onboarded users navigating the app for the
 * hundredth time. The onboarding gate is a UX flow, not a data-access
 * boundary (RLS + auth.uid() already gate all real data), so proxy.ts
 * decides it from a lightweight cookie instead — see ONBOARDING_COOKIE.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // request.headers reflects whatever the client sent, so always clear
  // these first — a client could otherwise send these exact header names
  // hoping a misconfigured downstream trusts them.
  request.headers.delete(VERIFIED_USER_ID_HEADER);
  request.headers.delete(VERIFIED_USER_EMAIL_HEADER);
  if (user) {
    request.headers.set(VERIFIED_USER_ID_HEADER, user.id);
    if (user.email) request.headers.set(VERIFIED_USER_EMAIL_HEADER, user.email);
  }

  // Rebuild the response now that headers changed, so the forwarded
  // request (not just the client-facing response) carries them —
  // NextResponse.next({ request }) is what controls what the page sees.
  // Any refreshed-session Set-Cookie headers already attached to the
  // previous supabaseResponse (from the setAll callback above) must be
  // copied across, or rebuilding here would silently drop the session
  // refresh.
  const previousResponse = supabaseResponse;
  supabaseResponse = NextResponse.next({ request });
  previousResponse.cookies.getAll().forEach((cookie) => {
    supabaseResponse.cookies.set(cookie);
  });

  return { supabase, supabaseResponse, user };
}
