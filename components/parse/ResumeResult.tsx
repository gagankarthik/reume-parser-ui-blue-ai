"use client";

import type { ReactNode } from "react";
import type {
  ConfidenceScores,
  Education,
  Experience,
  ParsedResume,
  PersonalInfo,
} from "@/lib/types";
import { Badge, Card, SectionTitle, cn } from "@/components/ui";

// ---- helpers ---------------------------------------------------------------

function hasText(v: string | null | undefined): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function barColor(v: number): string {
  if (v >= 0.9) return "bg-green-500";
  if (v >= 0.7) return "bg-amber-500";
  return "bg-red-500";
}

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function formatDateRange(exp: Experience): string | null {
  const start = hasText(exp.start_date) ? exp.start_date : null;
  const end = exp.is_current ? "Present" : hasText(exp.end_date) ? exp.end_date : null;
  if (start && end) return `${start} – ${end}`;
  if (start) return `${start} – Present`;
  if (end) return end;
  return null;
}

function eduYears(edu: Education): string | null {
  const start = edu.start_year != null ? String(edu.start_year) : null;
  const end = edu.graduation_year != null ? String(edu.graduation_year) : null;
  if (start && end) return `${start} – ${end}`;
  if (end) return end;
  if (start) return `${start} –`;
  return null;
}

// ---- small presentational bits --------------------------------------------

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 break-all"
    >
      {children}
    </a>
  );
}

function Chips({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "info" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <Badge key={`${item}-${i}`} tone={tone}>
          {item}
        </Badge>
      ))}
    </div>
  );
}

// ---- confidence ------------------------------------------------------------

const CONFIDENCE_FIELDS: Array<{ key: keyof ConfidenceScores; label: string }> = [
  { key: "overall", label: "Overall" },
  { key: "personal_info", label: "Personal info" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
];

function ConfidencePanel({ confidence }: { confidence: ConfidenceScores }) {
  return (
    <Card>
      <SectionTitle hint="How sure the parser is about each section.">
        Confidence
      </SectionTitle>
      <div className="space-y-3">
        {CONFIDENCE_FIELDS.map(({ key, label }) => {
          const value = confidence[key] ?? 0;
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {pct(value)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={cn("h-full rounded-full transition-all", barColor(value))}
                  style={{ width: pct(value) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---- sections --------------------------------------------------------------

function PersonalInfoPanel({ info }: { info: PersonalInfo }) {
  const links: Array<{ label: string; href: string }> = [];
  if (hasText(info.linkedin_url)) links.push({ label: "LinkedIn", href: info.linkedin_url });
  if (hasText(info.github_url)) links.push({ label: "GitHub", href: info.github_url });
  if (hasText(info.portfolio_url)) links.push({ label: "Portfolio", href: info.portfolio_url });

  const contacts: Array<{ label: string; value: string }> = [];
  if (hasText(info.email)) contacts.push({ label: "Email", value: info.email });
  if (hasText(info.phone)) contacts.push({ label: "Phone", value: info.phone });
  if (hasText(info.location)) contacts.push({ label: "Location", value: info.location });

  return (
    <Card>
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {hasText(info.full_name) ? info.full_name : "Unnamed candidate"}
      </h2>

      {(contacts.length > 0 || links.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {contacts.map((c) => (
            <span key={c.label}>{c.value}</span>
          ))}
          {links.map((l) => (
            <ExternalLink key={l.label} href={l.href}>
              {l.label}
            </ExternalLink>
          ))}
        </div>
      )}

      {hasText(info.summary) && (
        <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {info.summary}
        </p>
      )}
    </Card>
  );
}

function ExperiencePanel({ items }: { items: Experience[] }) {
  return (
    <Card>
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-6">
        {items.map((exp, i) => {
          const range = formatDateRange(exp);
          return (
            <div
              key={i}
              className={cn(
                i > 0 && "border-t border-zinc-100 pt-6 dark:border-zinc-800",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {hasText(exp.role) ? exp.role : "—"}
                  {hasText(exp.company) && (
                    <span className="font-normal text-zinc-500 dark:text-zinc-400">
                      {" "}
                      · {exp.company}
                    </span>
                  )}
                </h3>
                {range && (
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {range}
                  </span>
                )}
              </div>

              {hasText(exp.location) && (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {exp.location}
                </p>
              )}

              {hasText(exp.description) && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {exp.description}
                </p>
              )}

              {exp.achievements.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                  {exp.achievements.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function EducationPanel({ items }: { items: Education[] }) {
  return (
    <Card>
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-5">
        {items.map((edu, i) => {
          const years = eduYears(edu);
          const degreeLine = [edu.degree, edu.field_of_study]
            .filter(hasText)
            .join(", ");
          return (
            <div
              key={i}
              className={cn(
                i > 0 && "border-t border-zinc-100 pt-5 dark:border-zinc-800",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {hasText(edu.institution) ? edu.institution : "—"}
                </h3>
                {years && (
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {years}
                  </span>
                )}
              </div>
              {degreeLine && (
                <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                  {degreeLine}
                </p>
              )}
              {hasText(edu.gpa) && (
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  GPA: {edu.gpa}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function CertificationsPanel({ items }: { items: ParsedResume["certifications"] }) {
  return (
    <Card>
      <SectionTitle>Certifications</SectionTitle>
      <div className="space-y-4">
        {items.map((cert, i) => (
          <div
            key={i}
            className={cn(
              i > 0 && "border-t border-zinc-100 pt-4 dark:border-zinc-800",
            )}
          >
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              {hasText(cert.name) ? cert.name : "—"}
            </h3>
            {hasText(cert.issuer) && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{cert.issuer}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {hasText(cert.issued_date) && <span>Issued: {cert.issued_date}</span>}
              {hasText(cert.expiry_date) && <span>Expires: {cert.expiry_date}</span>}
              {hasText(cert.credential_id) && <span>ID: {cert.credential_id}</span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectsPanel({ items }: { items: ParsedResume["projects"] }) {
  return (
    <Card>
      <SectionTitle>Projects</SectionTitle>
      <div className="space-y-5">
        {items.map((proj, i) => (
          <div
            key={i}
            className={cn(
              i > 0 && "border-t border-zinc-100 pt-5 dark:border-zinc-800",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {hasText(proj.name) ? proj.name : "—"}
              </h3>
              {hasText(proj.url) && <ExternalLink href={proj.url}>Link</ExternalLink>}
            </div>
            {hasText(proj.description) && (
              <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {proj.description}
              </p>
            )}
            {proj.technologies.length > 0 && (
              <div className="mt-2">
                <Chips items={proj.technologies} tone="info" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---- main ------------------------------------------------------------------

export function ResumeResult({
  data,
  confidence,
}: {
  data: ParsedResume;
  confidence: ConfidenceScores | null;
}) {
  const info = data.personal_info;

  return (
    <div className="space-y-6">
      {confidence && <ConfidencePanel confidence={confidence} />}

      {info && <PersonalInfoPanel info={info} />}

      {data.experience.length > 0 && <ExperiencePanel items={data.experience} />}

      {data.education.length > 0 && <EducationPanel items={data.education} />}

      {data.skills.length > 0 && (
        <Card>
          <SectionTitle>Skills</SectionTitle>
          <Chips items={data.skills} tone="neutral" />
        </Card>
      )}

      {data.languages.length > 0 && (
        <Card>
          <SectionTitle>Languages</SectionTitle>
          <Chips items={data.languages} tone="neutral" />
        </Card>
      )}

      {data.certifications.length > 0 && (
        <CertificationsPanel items={data.certifications} />
      )}

      {data.projects.length > 0 && <ProjectsPanel items={data.projects} />}
    </div>
  );
}
