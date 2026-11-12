import Link from "next/link";
import { Portrait } from "@/components/Portrait";
import { PreviewLink } from "@/components/PreviewLink";
import { journalByYear, photoCount } from "@/data/photos";
import { links, profile, projects, work, type Entry } from "@/data/site";

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="list">
      {entries.map((e) => (
        <li key={`${e.role}-${e.name}`}>
          {e.role ? <span className="muted">{e.role} at </span> : null}
          {e.href ? (
            <PreviewLink href={e.href} preview={e.preview}>
              {e.name}
            </PreviewLink>
          ) : (
            <span>{e.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const latestYear = photoCount > 0 ? journalByYear()[0] : null;

  return (
    <div className="home">
      <Portrait src="/portrait-cutout.png" sheet={latestYear} />

      <main id="main" className="intro">
        <h1>{profile.name}</h1>
        <p className="subline">
          {profile.study} at{" "}
          <PreviewLink href={profile.school.href} preview={profile.school.preview}>
            {profile.school.label}
          </PreviewLink>
        </p>
        <p className="bio muted">
          I go by Khai. I tutor Java, build full-stack web apps, and I’m transferring to a
          University of California in Fall 2027. I’m looking for a backend software engineering
          internship. Away from the keyboard I take a lot of photos, and keep one from every month
          in my{" "}
          <Link className="inline-link" href="/photos">
            photo journal
          </Link>
          .
        </p>

        <section aria-labelledby="work">
          <h2 id="work">Work</h2>
          <EntryList entries={work} />
        </section>

        <section aria-labelledby="projects">
          <h2 id="projects">Projects</h2>
          <EntryList entries={projects} />
        </section>
      </main>

      <footer className="footer">
        <ul>
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" })}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
