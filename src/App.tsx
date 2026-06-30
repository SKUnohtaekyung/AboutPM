import { useState } from "react";
import { ChapterDetail } from "./components/ChapterDetail";
import { NetworkGraphView } from "./components/NetworkGraphView";
import { curriculumData } from "./data/curriculum/curriculumData";
import { useLenisScroll } from "./hooks/useLenisScroll";
import "./styles.css";

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  useLenisScroll();

  const isHub = !activeChapterId;

  return (
    <div className={`app-root ${isHub ? "hub-active" : "spoke-active"}`}>
      <div className="abstract-bg"></div>

      {isHub ? (
        <NetworkGraphView onSelect={setActiveChapterId} />
      ) : (
        <ChapterDetail
          chapter={curriculumData.find((c) => c.id === activeChapterId)!}
          onBack={() => setActiveChapterId(null)}
        />
      )}
    </div>
  );
}
