import type { CurriculumChapter, LessonMeta } from "./curriculumData";

const lessonMarkdownModules = import.meta.glob("./lessons/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function toLessonModuleKey(contentFile: string): string {
  const normalizedPath = contentFile.replace(/\\/g, "/").replace(/^\.?\//, "");
  return `./${normalizedPath}`;
}

export async function loadLessonMarkdown(lesson: LessonMeta): Promise<string> {
  const moduleKey = toLessonModuleKey(lesson.content_file);
  const loader = lessonMarkdownModules[moduleKey];

  if (!loader) {
    throw new Error(`Markdown file not found for ${lesson.id}: ${lesson.content_file}`);
  }

  return loader();
}

export async function loadChapterMarkdown(chapter: CurriculumChapter): Promise<string> {
  const sortedLessons = [...chapter.lessons].sort((a, b) => a.order - b.order);
  const lessonMarkdown = await Promise.all(sortedLessons.map(loadLessonMarkdown));

  return lessonMarkdown.join("\n\n---\n\n");
}
