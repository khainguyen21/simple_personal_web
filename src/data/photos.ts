// The photo journal: one photo for every month.
//
// To add a photo:
//   1. Export it as a JPG (about 2000px on the long side is plenty) and put it in
//      public/photos/, named by month, e.g. public/photos/2021-03.jpg
//   2. Add a line below. Order doesn't matter, and gaps are fine — a month
//      without a photo shows as an empty frame.

export type JournalPhoto = {
  /** "YYYY-MM" */
  month: string;
  /** Path under public/, e.g. "/photos/2021-03.jpg" */
  src: string;
  /** Where it was taken, shown under the photo. */
  place?: string;
  /** Describe the photo for screen readers. */
  alt: string;
};

export const journal: JournalPhoto[] = [
  // { month: "2026-10", src: "/photos/2026-10.jpg", place: "San Jose", alt: "Sunset over the hills" },
];

/** Shown when the journal is still empty, so the layout can be previewed. */
const PREVIEW_YEAR = 2026;

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type JournalYear = {
  year: number;
  /** Always 12 slots, January first; null where that month has no photo yet. */
  months: (JournalPhoto | null)[];
};

/** Newest year first. Only years that have at least one photo are listed. */
export function journalByYear(): JournalYear[] {
  const byYear = new Map<number, (JournalPhoto | null)[]>();
  for (const photo of journal) {
    const [y, m] = photo.month.split("-").map(Number);
    if (!y || !m || m < 1 || m > 12) {
      throw new Error(`Photo journal: "${photo.month}" should look like "2021-03".`);
    }
    if (!byYear.has(y)) byYear.set(y, Array(12).fill(null));
    byYear.get(y)![m - 1] = photo;
  }
  if (byYear.size === 0) byYear.set(PREVIEW_YEAR, Array(12).fill(null));
  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({ year, months }));
}

export const photoCount = journal.length;
