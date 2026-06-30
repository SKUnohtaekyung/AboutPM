import { curriculumData, type CurriculumChapter } from "../data/curriculum/curriculumData";
import { useChapterMarkdown } from "../hooks/useChapterMarkdown";
import { useChapterScrollProgress } from "../hooks/useChapterScrollProgress";
import { ChapterBackButton } from "./ChapterBackButton";
import { MarkdownContent } from "./MarkdownContent";

type ChapterDetailProps = {
  chapter: CurriculumChapter;
  onBack: () => void;
};

export function ChapterDetail({ chapter, onBack }: ChapterDetailProps) {
  const { markdown, isLoading, error } = useChapterMarkdown(chapter);
  const scrollRefreshKey = isLoading ? "loading" : error ? "error" : "ready";
  const { containerRef, leftPaneRef, rightPaneRef, scrollProgress } = useChapterScrollProgress(
    chapter.id,
    scrollRefreshKey
  );
  const index = curriculumData.findIndex((c) => c.id === chapter.id) + 1;

  return (
    <div ref={containerRef} className="chapter-layout">
      <ChapterBackButton onBack={onBack} className="mobile-back-btn">
        홈으로
      </ChapterBackButton>

      <div ref={leftPaneRef} className="split-left">
        <ChapterBackButton onBack={onBack} className="desktop-back-btn">
          3D 지도로 돌아가기
        </ChapterBackButton>

        <p className="chapter-label">NODE {index}</p>
        <h1 className="chapter-title">{chapter.title}</h1>
        <p className="chapter-subtitle">{chapter.subtitle}</p>

        <div className="progress-container">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${scrollProgress}%` }}></div>
          </div>
          <p className="progress-hint">독서 진행률: {Math.round(scrollProgress)}%</p>
        </div>
      </div>

      <div ref={rightPaneRef} className="split-right">
        <div className="scroll-section">
          <div className="analogy-block">
            <span className="analogy-tag">유치원생 비유 (개념 풀이)</span>
            <h2 className="analogy-title">{chapter.metaphor.title}</h2>
            <p className="analogy-desc">{chapter.metaphor.description}</p>
            {chapter.metaphor.imageAsset && (
              <img src={chapter.metaphor.imageAsset} alt="Concept Asset 3D" className="analogy-asset" />
            )}
          </div>

          {isLoading && <MarkdownStatusMessage title="본문을 불러오는 중입니다" />}
          {error && <MarkdownStatusMessage title="본문을 불러오지 못했습니다" detail={error} />}
          {!isLoading && !error && <MarkdownContent markdown={markdown} />}
        </div>
      </div>
    </div>
  );
}

function MarkdownStatusMessage({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="markdown-body">
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
    </div>
  );
}
