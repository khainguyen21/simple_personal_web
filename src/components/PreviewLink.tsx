import Image from "next/image";
import type { Preview } from "@/data/site";

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

/** An underlined link that shows a small card about where it goes on hover or focus. */
export function PreviewLink({
  href,
  preview,
  children,
}: {
  href: string;
  preview?: Preview;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <span className="preview">
      <a
        className="inline-link"
        href={href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
      >
        {children}
      </a>
      {preview && (
        <span className="preview-card" aria-hidden="true">
          {preview.image ? (
            <span className="preview-shot">
              <Image src={preview.image} alt="" fill sizes="280px" />
            </span>
          ) : null}
          <span className="preview-body">
            <span className="preview-host">{hostOf(href)}</span>
            <span className="preview-title">{preview.title}</span>
            <span className="preview-desc">{preview.description}</span>
          </span>
        </span>
      )}
    </span>
  );
}
