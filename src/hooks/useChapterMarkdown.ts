import { useEffect, useState } from "react";
import type { CurriculumChapter } from "../data/curriculum/curriculumData";
import { loadChapterMarkdown } from "../data/curriculum/markdownLoaders";

type ChapterMarkdownState = {
  markdown: string;
  isLoading: boolean;
  error: string | null;
};

export function useChapterMarkdown(chapter: CurriculumChapter): ChapterMarkdownState {
  const [state, setState] = useState<ChapterMarkdownState>({
    markdown: "",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    setState({
      markdown: "",
      isLoading: true,
      error: null,
    });

    loadChapterMarkdown(chapter)
      .then((markdown) => {
        if (isCancelled) return;
        setState({
          markdown,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (isCancelled) return;
        const message = error instanceof Error ? error.message : "Unknown markdown loading error";
        setState({
          markdown: "",
          isLoading: false,
          error: message,
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [chapter]);

  return state;
}
