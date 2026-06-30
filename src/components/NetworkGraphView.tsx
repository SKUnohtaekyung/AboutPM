import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import { curriculumData } from "../data/curriculum/curriculumData";
import { useWindowSize } from "../hooks/useWindowSize";
import type { GraphData, GraphLink, GraphNode } from "../types/graph";

type NetworkGraphViewProps = {
  onSelect: (id: string) => void;
};

export function NetworkGraphView({ onSelect }: NetworkGraphViewProps) {
  const fgRef = useRef<ForceGraphMethods>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const windowSize = useWindowSize();

  useEffect(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    nodes.push({
      id: "hub_core",
      name: "PM 마스터클래스",
      labelText: "PM 마스터클래스",
      val: 200,
      colorHex: "#FFC400",
      opacity: 1,
      isSubNode: false,
    });

    curriculumData.forEach((chapter, i) => {
      const chapterVal = 130 - i * 3;
      nodes.push({
        id: chapter.id,
        name: chapter.title,
        labelText: `Ch.${i + 1} ${chapter.title}`,
        val: chapterVal,
        colorHex: "#35244A",
        opacity: 0.95,
        chapterId: chapter.id,
        isSubNode: false,
      });

      links.push({
        source: "hub_core",
        target: chapter.id,
        color: "rgba(53, 36, 74, 0.4)",
        width: 2,
      });

      chapter.subConcepts?.forEach((concept, j) => {
        const opacityVariation = 0.5 + j * 0.15;
        nodes.push({
          id: concept.id,
          name: concept.name,
          labelText: concept.name,
          val: 32,
          colorHex: "#A259FF",
          opacity: opacityVariation,
          chapterId: chapter.id,
          isSubNode: true,
        });

        links.push({
          source: chapter.id,
          target: concept.id,
          color: `rgba(162, 89, 255, ${opacityVariation * 0.5})`,
          width: 0.8,
        });
      });
    });

    setGraphData({ nodes, links });
  }, []);

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      const isMobile = windowSize.width < 1024;
      const linkForce = fgRef.current.d3Force("link");

      if (linkForce) {
        linkForce.distance((link: any) => {
          const baseDistance = link.source.id === "hub_core" ? 80 : 40;
          return isMobile ? baseDistance * 0.7 : baseDistance;
        });
      }

      const chargeForce = fgRef.current.d3Force("charge");
      if (chargeForce) {
        chargeForce.strength(isMobile ? -150 : -200);
      }
    }
  }, [graphData, windowSize.width]);

  const handleNodeClick = useCallback(
    (node: any) => {
      if (node.id === "hub_core") return;
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
      <div className="toss-left-panel">
        <h1 className="toss-title">
          PM 성장의 모든 것,<br />
          단 하나의 맵으로.
        </h1>
        <p className="toss-desc">
          제품의 탄생부터 리더십까지. 유기적으로 연결된 3D 행성계에서 빠르고 직관적으로 이론을 탐색하세요.
          <br />
          <b>지금 바로 지식을 워프해보세요.</b>
        </p>

        <div className="toss-instruction-box">
          <div className="icon-pulse"></div>
          <div>
            <p className="instruction-head">행성을 마음껏 탐험해보세요!</p>
            <p className="instruction-sub">
              우주를 드래그해 회전시키고,
              <br />
              원하는 <b>행성(구체)을 클릭하면 챕터로 즉시 워프</b>합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="toss-right-panel">
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeRelSize={3}
          width={windowSize.width < 1024 ? windowSize.width : windowSize.width * 0.75}
          height={windowSize.width < 1024 ? windowSize.height * 0.6 : windowSize.height}
          nodeThreeObject={(node) => {
            const typedNode = node as GraphNode;
            const isCore = typedNode.id === "hub_core";
            const group = new THREE.Group();
            const radius = Math.cbrt(typedNode.val) * 3.5;

            const material = new THREE.MeshStandardMaterial({
              color: typedNode.colorHex,
              transparent: true,
              opacity: typedNode.opacity,
              roughness: 0.1,
              metalness: isCore ? 0.3 : 0.1,
              emissive: typedNode.colorHex,
              emissiveIntensity: isCore ? 0.3 : 0.1,
            });

            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);

            if (!typedNode.isSubNode || isCore) {
              const sprite = new SpriteText(typedNode.labelText);
              sprite.color = "#35244A";
              sprite.textHeight = Math.max(8, radius * 0.45);
              sprite.fontWeight = "bold";
              sprite.fontFace = "Pretendard Variable";
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
