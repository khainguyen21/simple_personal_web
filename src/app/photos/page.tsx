import type { Metadata } from "next";
import Link from "next/link";
import { Journal } from "@/components/Journal";
import { journalByYear, photoCount } from "@/data/photos";

export const metadata: Metadata = {
  title: "Photo journal",
  description: "One photo for every month.",
};

export default function PhotosPage() {
  const years = journalByYear();
  const oldest = years[years.length - 1].year;

  return (
    <main id="main" className="journal">
      <Link href="/" className="back">
        <span aria-hidden="true">← </span>Back
      </Link>
      <header className="journal-head">
        <h1>Photo journal</h1>
        <p className="muted">
          One photo for every month{photoCount > 0 ? `, since ${oldest}` : ""}. Twelve a year, picked
          from everything I shot that month.
        </p>
      </header>
      <Journal years={years} />
    </main>
  );
}
