export type RawNode = {
  id: string;
  type: string;
  data: {
    id: string;
    name: string;
    type: string;
    formData?: { name: string; value: string }[];
  };
};

export type RawEdge = {
  id: string;
  source: string;
  target: string;
};

export type ExecNode = {
  id: string;
  type: string;
  data: { formData?: { name: string; value: string }[] };
};

export type ExecEdge = { source: string; target: string };

export function extractExecNE(rawNodes: RawNode[], rawEdges: RawEdge[]) {
  const nodes: ExecNode[] = rawNodes.map((n) => ({
    id: n.id,
    type: n.data.type, // use execution type
    data: {
      formData: n.data.formData ?? [],
    },
  }));

  const edges: ExecEdge[] = rawEdges.map((e) => ({
    source: e.source,
    target: e.target,
  }));
  const runnerId = nodes.find((n) => n.type === "manual")?.id;
  return { nodes, edges, runnerId };
}
