import type { ContentSource, DocItem, SectionItem } from "../types";

type RawModuleMap = Record<string, string>;

const mdModules = import.meta.glob("/MD/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
}) as RawModuleMap;

const rootModules = import.meta.glob("/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
}) as RawModuleMap;

const EN_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "this",
  "from",
  "are",
  "was",
  "were",
  "into",
  "your",
  "have",
  "has",
  "will",
  "about",
  "what",
  "when",
  "where",
  "which",
  "while",
  "through",
  "using",
  "used",
  "use"
]);

function normalizeTitle(path: string): string {
  const fileName = path.split("/").pop() ?? path;
  return fileName.replace(/\.md$/i, "");
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\uac00-\ud7a3a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function cleanText(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSummary(raw: string): string {
  const text = cleanText(raw);
  if (!text) return "No summary available.";
  return text.slice(0, 180);
}

function getHeadings(raw: string): string[] {
  const headingRegex = /^#{1,3}\s+(.+)$/gm;
  const headings: string[] = [];
  let match = headingRegex.exec(raw);
  while (match) {
    headings.push(match[1].trim());
    match = headingRegex.exec(raw);
  }
  return headings;
}

function getReadingMinutes(raw: string): number {
  const plainLength = cleanText(raw).length;
  if (!plainLength) return 1;
  return Math.max(1, Math.ceil(plainLength / 700));
}

function chunkWithoutHeadings(raw: string, docTitle: string): SectionItem[] {
  const paragraphs = raw
    .split(/\r?\n\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  const sections: SectionItem[] = [];
  let bucket = "";
  let order = 0;

  for (const paragraph of paragraphs) {
    const next = `${bucket}\n\n${paragraph}`.trim();
    if (next.length > 1400 && bucket.length > 0) {
      order += 1;
      const body = bucket.trim();
      sections.push(makeSection(docTitle, order, `Section ${order}`, body));
      bucket = paragraph;
    } else {
      bucket = next;
    }
  }

  if (bucket.trim()) {
    order += 1;
    sections.push(makeSection(docTitle, order, `Section ${order}`, bucket.trim()));
  }

  return sections;
}

function extractKeywords(text: string): string[] {
  const tokens = cleanText(text)
    .toLowerCase()
    .match(/[\uac00-\ud7a3a-z0-9][\uac00-\ud7a3a-z0-9-]{2,24}/g);
  if (!tokens) return [];

  const freq = new Map<string, number>();
  for (const token of tokens) {
    if (/^\d+$/.test(token)) continue;
    if (EN_STOPWORDS.has(token)) continue;
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);
}

function makeSection(docTitle: string, order: number, title: string, body: string): SectionItem {
  const clean = cleanText(body);
  return {
    id: `${toSlug(docTitle)}-section-${order}`,
    title: title.trim() || `Section ${order}`,
    body,
    summary: clean.slice(0, 170) || "No summary available.",
    keywords: extractKeywords(clean),
    wordCount: clean.length,
    order
  };
}

function parseSections(raw: string, docTitle: string): SectionItem[] {
  const lines = raw.split(/\r?\n/);
  const sections: SectionItem[] = [];
  let currentTitle = "Document Overview";
  let bucket: string[] = [];
  let order = 0;

  const flush = () => {
    const body = bucket.join("\n").trim();
    if (!body) return;
    order += 1;
    sections.push(makeSection(docTitle, order, currentTitle, body));
    bucket = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      flush();
      currentTitle = headingMatch[1].trim();
      continue;
    }
    bucket.push(line);
  }

  flush();

  if (sections.length === 0) {
    return chunkWithoutHeadings(raw, docTitle);
  }

  return sections;
}

function buildDocs(modules: RawModuleMap, source: ContentSource): DocItem[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const title = normalizeTitle(path);
      const slug = toSlug(title);
      const sections = parseSections(raw, title);
      const totalWords = sections.reduce((sum, item) => sum + item.wordCount, 0);

      return {
        id: `${source}:${slug}`,
        slug,
        title,
        path,
        raw,
        summary: getSummary(raw),
        headings: getHeadings(raw),
        readingMinutes: getReadingMinutes(raw),
        source,
        sections,
        totalWords
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

export function loadDocs(): {
  docs: DocItem[];
  source: ContentSource;
  isMdFolderEmpty: boolean;
} {
  const mdDocs = buildDocs(mdModules, "md-folder");
  if (mdDocs.length > 0) {
    return { docs: mdDocs, source: "md-folder", isMdFolderEmpty: false };
  }

  const fallbackDocs = buildDocs(rootModules, "root-fallback");
  return { docs: fallbackDocs, source: "root-fallback", isMdFolderEmpty: true };
}
