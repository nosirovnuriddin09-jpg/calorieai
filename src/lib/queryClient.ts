import { QueryClient, isServer } from "@tanstack/react-query";

/**
 * Global defaults. Individual query hooks override staleTime where a
 * domain's actual change frequency differs from this baseline:
 *  - "today" data (meals/water/exercise/sleep/steps for the current day)
 *    changes whenever the user logs something, so it uses a short
 *    staleTime and gets invalidated explicitly by mutations.
 *  - historical ranges (past days/weeks) don't change once the day is
 *    over, so they can be cached far longer.
 *  - profile/goals change rarely (onboarding, settings) and get a long
 *    staleTime.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns a QueryClient. On the server a fresh instance is created per
 * request (no shared state between requests). In the browser a single
 * instance is memoized across renders so React strict-mode/HMR and
 * component re-renders never spin up a second client with its own cache.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
