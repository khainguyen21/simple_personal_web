"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MONTHS, type JournalYear } from "@/data/photos";

type Tile = { x: number; y: number; size: number; dist: number };

const CELL = 6; // CSS px per tile
const REPEL_RADIUS = 72;
const REPEL_PUSH = 9;
const DISSOLVE_MS = 520;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * The portrait drawn as a field of small squares, darker areas as bigger squares.
 * Squares lean away from the cursor. When there are journal photos, hovering
 * dissolves the portrait into that year's twelve months.
 */
export function Portrait({ src, sheet }: { src: string; sheet: JournalYear | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const hasSheet = sheet !== null && sheet.months.some(Boolean);

  // Live values the animation loop reads without re-rendering React.
  const live = useRef({
    pointer: { x: -9999, y: -9999 },
    origin: { x: 0, y: 0 },
    repel: 0, // 0..1, eases in when the pointer is over the portrait
    repelTarget: 0,
    dissolve: 0, // 0..1, portrait -> photo sheet
    dissolveTarget: 0,
    reduced: false,
  });

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const state = live.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.reduced = motionQuery.matches;

    let tiles: Tile[] = [];
    let size = 0;
    let ink = "#1d2619";
    // Light is the default; dark only when chosen with the toggle (<html data-theme>).
    const isDark = () => document.documentElement.dataset.theme === "dark";
    let dark = isDark();
    let frame = 0;
    let last = 0;
    let img: HTMLImageElement | null = null;

    const readInk = () => {
      ink = getComputedStyle(wrap).getPropertyValue("--accent").trim() || ink;
    };

    const build = () => {
      if (!img) return;
      size = wrap.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.floor(size / CELL);
      const off = document.createElement("canvas");
      off.width = n;
      off.height = n;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      octx.imageSmoothingQuality = "high";
      octx.drawImage(img, 0, 0, n, n);
      const { data } = octx.getImageData(0, 0, n, n);

      // Even out the tones using only the pixels that belong to the subject
      // (histogram equalisation), so the backlit face still shows its features.
      const lumAt = (i: number) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      // Measure the head only — the dark shirt would otherwise hog the dark end.
      const lums: number[] = [];
      const headRows = Math.floor(n * 0.62);
      for (let i = 0; i < n * headRows; i++) {
        if (data[i * 4 + 3] > 140) lums.push(lumAt(i * 4));
      }
      lums.sort((a, b) => a - b);
      const rank = (v: number) => {
        let lo = 0;
        let hi = lums.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (lums[mid] < v) lo = mid + 1;
          else hi = mid;
        }
        return lums.length ? lo / lums.length : 0.5;
      };

      // Light theme: dark ink on paper, so darker areas get bigger squares.
      // Dark theme: light ink on dark, so lighter areas get bigger squares.
      const positive = dark;
      const pad = (size - n * CELL) / 2;
      const fadeStart = n * 0.64; // shoulders fade out toward the bottom
      tiles = [];
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          const i = (row * n + col) * 4;
          const alpha = data[i + 3] / 255;
          if (alpha < 0.55) continue;
          const light = rank(lumAt(i));
          const weight = positive ? light : 1 - light;
          const fade = row > fadeStart ? 1 - (row - fadeStart) / (n - fadeStart) : 1;
          const s = CELL * (0.14 + 0.72 * weight ** 1.1) * fade;
          if (s < 0.9) continue;
          tiles.push({ x: pad + col * CELL + CELL / 2, y: pad + row * CELL + CELL / 2, size: s, dist: 0 });
        }
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = ink;
      const { pointer, origin, repel, dissolve, reduced } = state;
      const maxDist = size * 1.2;
      for (const t of tiles) {
        let { x, y } = t;
        let s = t.size;
        if (repel > 0.001 && !reduced) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL_RADIUS && d > 0.01) {
            const f = (1 - d / REPEL_RADIUS) ** 2 * repel;
            x += (dx / d) * f * REPEL_PUSH;
            y += (dy / d) * f * REPEL_PUSH;
            s *= 1 - f * 0.45;
          }
        }
        if (dissolve > 0.001) {
          // A wave that starts where the cursor came in and rolls outward.
          const d = Math.hypot(t.x - origin.x, t.y - origin.y) / maxDist;
          const k = reduced ? dissolve : easeInOut(clamp01((dissolve - d * 0.55) / 0.45));
          s *= 1 - k;
        }
        if (s < 0.4) continue;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;
      const step = (cur: number, target: number, ms: number) =>
        cur < target ? Math.min(target, cur + dt / ms) : Math.max(target, cur - dt / ms);
      state.repel = step(state.repel, state.repelTarget, 220);
      state.dissolve = state.reduced
        ? state.dissolveTarget
        : step(state.dissolve, state.dissolveTarget, DISSOLVE_MS);
      draw();
      // Stop the loop once everything has arrived; pointer moves restart it.
      const settled = state.repel === state.repelTarget && state.dissolve === state.dissolveTarget;
      frame = settled ? 0 : requestAnimationFrame(tick);
      if (settled) last = 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      state.pointer = local(e);
      state.origin = local(e);
      state.repelTarget = 1;
      if (hasSheet) {
        state.dissolveTarget = 1;
        setOpen(true);
      }
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      state.pointer = local(e);
      if (state.repelTarget === 0) state.repelTarget = 1;
      kick();
    };
    const onLeave = () => {
      state.repelTarget = 0;
      state.dissolveTarget = 0;
      setOpen(false);
      kick();
    };

    const onScheme = () => {
      dark = isDark();
      readInk();
      build();
    };
    const onMotion = () => {
      state.reduced = motionQuery.matches;
    };
    const resize = new ResizeObserver(() => {
      if (wrap.clientWidth !== size) build();
    });

    readInk();
    const image = new window.Image();
    image.onload = () => {
      img = image;
      build();
      resize.observe(wrap);
    };
    image.src = src;

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    const themeWatch = new MutationObserver(onScheme);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    motionQuery.addEventListener("change", onMotion);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      themeWatch.disconnect();
      motionQuery.removeEventListener("change", onMotion);
    };
  }, [src, hasSheet]);

  return (
    <div className="portrait">
      <div ref={wrapRef} className={`portrait-stage${open ? " is-open" : ""}`}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Portrait of Hong Khai Nguyen, drawn in small squares"
        />
        {hasSheet && (
          <Link href="/photos" className="sheet" tabIndex={-1} aria-hidden={!open}>
            {sheet!.months.map((photo, i) => (
              <span key={i} className="sheet-cell" style={{ "--i": i } as React.CSSProperties}>
                {photo ? (
                  <Image src={photo.src} alt="" fill sizes="96px" />
                ) : (
                  <span className="sheet-empty">{MONTHS[i]}</span>
                )}
              </span>
            ))}
          </Link>
        )}
      </div>
      <Link href="/photos" className="pill">
        {hasSheet ? `${sheet!.year}, one photo a month` : "Photo journal"}
        <span aria-hidden="true"> →</span>
      </Link>
    </div>
  );
}
