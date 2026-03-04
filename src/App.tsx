import React, { useEffect, useState, useRef, useCallback } from "react";
import { curriculumData, CurriculumChapter } from "./data/curriculum/curriculumData";
import Lenis from "@studio-freight/lenis";
import "./styles.css";
import { ChevronLeft } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as THREE from "three";
import SpriteText from 'three-spritetext';

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// APP ROOT
// ----------------------------------------------------
export default function App() {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const isHub = !activeChapterId;

  return (
    <div className={`app-root ${isHub ? "hub-active" : "spoke-active"}`}>
      <div className="abstract-bg"></div>

      {isHub ? (
        <NetworkGraphView onSelect={setActiveChapterId} />
      ) : (
        <ChapterDetail
          chapter={curriculumData.find(c => c.id === activeChapterId)!}
          onBack={() => setActiveChapterId(null)}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3D NETWORK GRAPH DASHBOARD (Toss Style Split Layout)
// ----------------------------------------------------
type Node = { id: string; name: string; val: number; colorHex: string; opacity: number; chapterId?: string; isSubNode: boolean; labelText: string };
type Link = { source: string; target: string; color: string; width: number };

function NetworkGraphView({ onSelect }: { onSelect: (id: string) => void }) {
  const fgRef = useRef<ForceGraphMethods>();
  const [graphData, setGraphData] = useState({ nodes: [] as Node[], links: [] as Link[] });
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle Dynamic Resize for WebView/Mobile
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];

    // The Central Hub Core (Even larger)
    nodes.push({
      id: 'hub_core',
      name: 'PM 마스터클래스',  // Renamed to Korean
      labelText: 'PM 마스터클래스',
      val: 200,
      colorHex: '#FFC400',
      opacity: 1,
      isSubNode: false
    });

    curriculumData.forEach((chapter, i) => {
      // 1. Chapters (Even larger)
      const chapterVal = 130 - (i * 3);
      nodes.push({
        id: chapter.id,
        name: chapter.title,
        labelText: `Ch.${i + 1} ${chapter.title}`,
        val: chapterVal,
        colorHex: '#35244A',
        opacity: 0.95,
        chapterId: chapter.id,
        isSubNode: false
      });

      links.push({
        source: 'hub_core',
        target: chapter.id,
        color: 'rgba(53, 36, 74, 0.4)',
        width: 2
      });

      // 2. Sub-Concepts
      chapter.subConcepts?.forEach((concept, j) => {
        const opacityVariation = 0.5 + (j * 0.15);
        nodes.push({
          id: concept.id,
          name: concept.name,
          labelText: concept.name,
          val: 32, // Doubled subnodes too
          colorHex: '#A259FF',
          opacity: opacityVariation,
          chapterId: chapter.id,
          isSubNode: true
        });

        links.push({
          source: chapter.id,
          target: concept.id,
          color: `rgba(162, 89, 255, ${opacityVariation * 0.5})`,
          width: 0.8
        });
      });
    });

    setGraphData({ nodes, links });
  }, []);

  // Post-mount forces adjustment for 70% link length
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      const isMobile = windowSize.width < 1024;

      // Pull nodes much closer together (default distance is ~30, setting shorter)
      const linkForce = fgRef.current.d3Force('link');
      if (linkForce) {
        linkForce.distance((link: any) => {
          // Shorter links for subnodes, slightly longer for core
          const baseDistance = link.source.id === 'hub_core' ? 80 : 40;
          return isMobile ? baseDistance * 0.7 : baseDistance;
        });
      }

      // Increase repulsion slightly to balance
      const chargeForce = fgRef.current.d3Force('charge');
      if (chargeForce) {
        chargeForce.strength(isMobile ? -150 : -200);
      }
    }
  }, [graphData, windowSize.width]);

  const handleNodeClick = useCallback(
    (node: any) => {
      if (node.id === 'hub_core') return;
      const targetId = node.chapterId || node.id;

      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      if (fgRef.current) {
        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node,
          1200
        );
      }

      setTimeout(() => {
        window.scrollTo(0, 0);
        onSelect(targetId);
      }, 1200);
    },
    [onSelect]
  );

  return (
    <div className="toss-hub-layout">
      {/* 1. Left Panel (Toss Style Typography & Instructions) */}
      <div className="toss-left-panel">
        <h1 className="toss-title">
          PM 성장의 모든 것,<br />
          단 하나의 맵으로.
        </h1>
        <p className="toss-desc">
          제품의 탄생부터 리더십까지. 유기적으로 연결된 3D 행성계에서 빠르고 직관적으로 이론을 탐색하세요.<br /><b>지금 바로 지식을 워프해보세요.</b>
        </p>

        <div className="toss-instruction-box">
          <div className="icon-pulse"></div>
          <div>
            <p className="instruction-head">행성을 마음껏 탐험해보세요!</p>
            <p className="instruction-sub">우주를 드래그해 회전시키고,<br />원하는 <b>행성(구체)을 클릭하면 챕터로 즉시 워프</b>합니다.</p>
          </div>
        </div>
      </div>

      <div className="toss-right-panel">
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeRelSize={3} // HUGE SCALE

          width={windowSize.width < 1024 ? windowSize.width : windowSize.width * 0.75}
          height={windowSize.width < 1024 ? windowSize.height * 0.6 : windowSize.height}

          nodeThreeObject={node => {
            const typedNode = node as Node;
            const isCore = typedNode.id === 'hub_core';

            // Group for Sphere + Text
            const group = new THREE.Group();

            const radius = Math.cbrt(typedNode.val) * 3.5; // HUGE

            const material = new THREE.MeshStandardMaterial({
              color: typedNode.colorHex,
              transparent: true,
              opacity: typedNode.opacity,
              roughness: 0.1,
              metalness: isCore ? 0.3 : 0.1,
              emissive: typedNode.colorHex,
              emissiveIntensity: isCore ? 0.3 : 0.1
            });

            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);

            // Persistent Text Label
            if (!typedNode.isSubNode || isCore) {
              const sprite = new SpriteText(typedNode.labelText);
              // Ensure black text for all persistent labels for visibility on light lilac
              sprite.color = '#35244A';
              sprite.textHeight = Math.max(8, radius * 0.45); // Scale text but keep a minimum
              sprite.fontWeight = 'bold';
              sprite.fontFace = 'Pretendard Variable'; // Matching brand font
              // Position slightly forward/above
              sprite.position.y = radius + (isCore ? 12 : 8);
              group.add(sprite);
            }

            return group;
          }}

          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={1.5}
          linkColor={(link: any) => link.color}
          linkWidth={(link: any) => link.width}

          backgroundColor="rgba(0,0,0,0)"
          onNodeClick={handleNodeClick}
          enableNodeDrag={true}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SPOKE VIEW: DEEP DIVE WITH REACT-MARKDOWN
// ----------------------------------------------------
function ChapterDetail({ chapter, onBack }: { chapter: CurriculumChapter; onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: isDesktop ? leftPaneRef.current : false,
          pinSpacing: false,
          onUpdate: (self) => {
            setScrollProgress(self.progress * 100);
          }
        });
      });


    }, containerRef);

    return () => ctx.revert();
  }, [chapter.id]);

  const index = curriculumData.findIndex(c => c.id === chapter.id) + 1;
  const markdownText = chapter.fullMarkdown || `## Content missing for ${chapter.title}`;

  return (
    <div ref={containerRef} className="chapter-layout">

      <button onClick={onBack} className="mobile-back-btn">
        <ChevronLeft className="icon-chevron" style={{ marginRight: 8 }} /> 홈으로
      </button>

      <div ref={leftPaneRef} className="split-left">
        <button onClick={onBack} className="desktop-back-btn">
          <ChevronLeft className="icon-chevron" style={{ marginRight: 8 }} /> 3D 지도로 돌아가기
        </button>

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

          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownText}
            </ReactMarkdown>
          </div>

        </div>

      </div>
    </div>
  );
}
