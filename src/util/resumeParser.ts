export interface ResumeSections {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  other: string;
}

const HEADERS = [
  { key: "summary", regex: /career objective/i },

  {
    key: "experience",
    regex:
      /(internship experience|work experience|professional experience)/i,
  },

  {
    key: "education",
    regex: /education/i,
  },

  {
    key: "skills",
    regex: /(core expertise|technical skills|skills)/i,
  },

  {
    key: "projects",
    regex: /(project experience|projects)/i,
  },

  {
    key: "certifications",
    regex: /(certifications|certificates)/i,
  },
] as const;

function prettifySection(text: string) {
  return text
    .replace(/\s*\|\s*/g, "\n") // Project | Tech → new line
    .replace(/\.\s+/g, ".\n")
    .replace(/(\d{4}\s*[-→]\s*\d{4})/g, "\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseResumeLocally(text: string): ResumeSections {
    const sections: ResumeSections = {
        summary: "",
        experience: "",
        education: "",
        skills: "",
        projects: "",
        certifications: "",
        other: "",
    };
    const normalized = text
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n +/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const matches = HEADERS.map((h) => ({
        key: h.key,
        match: normalized.match(h.regex),
    }))
        .filter((x) => x.match)
        .map((x) => ({
        key: x.key,
        index: x.match!.index!,
        header: x.match![0],
        }))
        .sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
        sections.other = normalized;
        return sections;
    }

    for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const next = matches[i + 1];

        const start = current.index + current.header.length;
        const end = next ? next.index : normalized.length;
        sections[current.key] = prettifySection(
            normalized.slice(start, end)
        );

    }

  return sections;
}