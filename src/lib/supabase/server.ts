import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { Database } from "@/types/database";
import { VERIFIED_USER_ID_HEADER, VERIFIED_USER_EMAIL_HEADER } from "./middleware";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll called from a Server Component — safe to ignore
            // because middleware refreshes the session on every request.
          }
        },
      },
    }
  );
}

/**
 * Reads the user identity that proxy.ts already verified for this exact
 * request via a real auth.getUser() network call, instead of repeating
 * that call in every page.tsx. Falls back to a live auth.getUser() check
 * only if the header is missing (e.g. a server context proxy.ts doesn't
 * run for), so pages are never left unprotected if that ever happens.
 *
 * Trust note: the header is only ever set by updateSession() in
 * lib/supabase/middleware.ts, AFTER verifying the session with Supabase,
 * and it always clears/overwrites the header on the request object
 * before forwarding — see that function's doc comment. A client cannot
 * make this header say anything proxy.ts didn't just verify.
 */
export async function getVerifiedUser(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ id: string; email: string | null } | null> {
  const headerList = await headers();
  const verifiedId = headerList.get(VERIFIED_USER_ID_HEADER);

  if (verifiedId) {
    return { id: verifiedId, email: headerList.get(VERIFIED_USER_EMAIL_HEADER) };
  }

  // No header present — proxy.ts didn't run for this request (shouldn't
  // happen for matched routes, but fail safe rather than fail open).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? { id: user.id, email: user.email ?? null } : null;
}
