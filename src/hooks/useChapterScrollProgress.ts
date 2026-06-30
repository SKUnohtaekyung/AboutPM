import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useChapterScrollProgress(chapterId: string, refreshKey: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
          };

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: isDesktop ? leftPaneRef.current : false,
            pinSpacing: false,
            onUpdate: (self) => {
              setScrollProgress(self.progress * 100);
            },
          });
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [chapterId, refreshKey]);

  return {
    containerRef,
    leftPaneRef,
    rightPaneRef,
    scrollProgress,
  };
}
