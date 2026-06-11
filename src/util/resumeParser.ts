export interface ResumeSections {
  [section: string]: string;
}

/**
 * Detect whether a line looks like a resume section heading
 */
function isSectionHeader(line: string): boolean {
  const cleaned = line.trim();

  if (!cleaned) return false;

  // Ignore very long text
  if (cleaned.length > 50) return false;

  // Ignore bullet points
  if (
    cleaned.startsWith("-") ||
    cleaned.startsWith("•")
  ) {
    return false;
  }

  // Ignore dates
  if (
    /^\d{4}/.test(cleaned) ||
    /\d{4}\s*[-–→]/.test(cleaned)
  ) {
    return false;
  }

  const words = cleaned.split(/\s+/);

  // Section titles are usually short
  if (words.length > 5) return false;

  // Avoid sentence-like content
  if (
    cleaned.includes(".") ||
    cleaned.includes(",")
  ) {
    return false;
  }

  // ALL CAPS
  const isUpper =
    cleaned === cleaned.toUpperCase();

  // Title Case
  const isTitleCase = words.every((word) =>
    /^[A-Z][a-zA-Z&/-]*$/.test(word)
  );

  return isUpper || isTitleCase;
}

/**
 * Normalize section key
 */
function normalizeSectionName(
  heading: string
): string {
  return heading
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

/**
 * Parse resume text into detected sections
 */
export function parseResumeLocally(
  text: string
): ResumeSections {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: ResumeSections = {};

  let currentSection = "general";

  sections[currentSection] = "";

  for (const line of lines) {
    if (isSectionHeader(line)) {
      const sectionName =
        normalizeSectionName(line);

      currentSection = sectionName;

      if (!sections[currentSection]) {
        sections[currentSection] = "";
      }

      continue;
    }

    sections[currentSection] += line + "\n";
  }

  // cleanup whitespace
  Object.keys(sections).forEach((key) => {
    sections[key] = sections[key].trim();
  });

  return sections;
}