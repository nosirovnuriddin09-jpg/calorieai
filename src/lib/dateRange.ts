import type { TimeRange } from "@/types/models";

export interface DateRange {
  /** Inclusive start, ISO timestamp. */
  startIso: string;
  /** Exclusive end, ISO timestamp. */
  endIso: string;
  /** Inclusive start date, YYYY-MM-DD, for date-typed columns. */
  startDate: string;
  /** Inclusive end date, YYYY-MM-DD, for date-typed columns. */
  endDate: string;
  /** Number of calendar days covered — used to average range totals. */
  days: number;
}

// Builds a YYYY-MM-DD string from the Date's LOCAL calendar fields.
// toISOString() would convert to UTC first, which shifts the date by one
// day for any timezone where local midnight falls on the previous UTC day.
export function toDateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's date as YYYY-MM-DD in the caller's local timezone. */
export function getLocalDateString(now: Date = new Date()): string {
  return toDateOnly(now);
}

/** All ranges are anchored to the caller's local "today" at midnight. */
export function getDateRange(range: TimeRange, now: Date = new Date()): DateRange {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endExclusive = new Date(startOfToday);
  endExclusive.setDate(endExclusive.getDate() + 1);

  let start: Date;
  if (range === "today") {
    start = new Date(startOfToday);
  } else if (range === "weekly") {
    start = new Date(startOfToday);
    start.setDate(start.getDate() - 6);
  } else {
    start = new Date(startOfToday);
    start.setDate(start.getDate() - 29);
  }

  const days = Math.round((endExclusive.getTime() - start.getTime()) / 86_400_000);

  return {
    startIso: start.toISOString(),
    endIso: endExclusive.toISOString(),
    startDate: toDateOnly(start),
    endDate: toDateOnly(startOfToday),
    days,
  };
}
