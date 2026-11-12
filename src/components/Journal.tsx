"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MONTHS, type JournalPhoto, type JournalYear } from "@/data/photos";

const caption = (p: JournalPhoto) => {
  const [y, m] = p.month.split("-").map(Number);
  return [`${MONTHS[m - 1]} ${y}`, p.place].filter(Boolean).join(" · ");
};

/** Each year as a row of twelve months. Click a photo to view it large. */
export function Journal({ years }: { years: JournalYear[] }) {
  // Flat list, newest first, for stepping through with the arrow keys.
  const flat = useMemo(
    () => years.flatMap((y) => [...y.months].reverse().filter((p): p is JournalPhoto => p !== null)),
    [years],
  );
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : Math.min(flat.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : Math.max(0, i - 1)));
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, flat.length, close]);

  const open = index === null ? null : flat[index];

  return (
    <>
      {years.map(({ year, months }) => {
        const count = months.filter(Boolean).length;
        return (
          <section key={year} className="year" aria-labelledby={`y${year}`}>
            <header className="year-head">
              <h2 id={`y${year}`}>{year}</h2>
              <span className="muted">{count} of 12</span>
            </header>
            <ol className="months">
              {months.map((photo, i) => (
                <li key={i} className="month">
                  {photo ? (
                    <button
                      type="button"
                      className="month-frame"
                      onClick={() => setIndex(flat.indexOf(photo))}
                      aria-label={`${caption(photo)}: ${photo.alt}`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 900px) 150px, (min-width: 560px) 30vw, 45vw"
                      />
                    </button>
                  ) : (
                    <span className="month-frame is-empty" aria-label={`${MONTHS[i]} ${year}: no photo yet`} />
                  )}
                  <span className="month-label">
                    {MONTHS[i]}
                    {photo?.place ? <span className="muted"> · {photo.place}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={caption(open)} onClick={close}>
          <figure onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img">
              <Image src={open.src} alt={open.alt} fill sizes="90vw" preload />
            </div>
            <figcaption>
              <span>{caption(open)}</span>
              <button type="button" onClick={close} autoFocus>
                Close
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
