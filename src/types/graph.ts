export type GraphNode = {
  id: string;
  name: string;
  val: number;
  colorHex: string;
  opacity: number;
  chapterId?: string;
  isSubNode: boolean;
  labelText: string;
};

export type GraphLink = {
  source: string;
  target: string;
  color: string;
  width: number;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};
