import DashboardSkeleton from "@/components/DashboardSkeleton";

// Rendered by Next.js immediately on navigation to /dashboard, while the
// page's server component (auth check + initial profile fetch) is still
// resolving — this is what lets the route shell appear instantly instead
// of the browser sitting on a blank/frozen previous page. Reuses the
// existing DashboardSkeleton so this looks identical to the loading state
// DashboardClient already shows for its own client-side data fetch.
export default function Loading() {
  return <DashboardSkeleton />;
}
