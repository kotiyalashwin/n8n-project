import { create } from "zustand";

type NodeData = {
  nodeId: string;
  data: { name: string; value: string }[];
};

type NodeDataStore = {
  nodeData: NodeData[] | [];
  addNodeData: (value: NodeData) => void;
  getNodeData: (nodeId: string) => NodeData | undefined;
};

export const useNodeDataStore = create<NodeDataStore>((set, get) => ({
  nodeData: [],
  addNodeData: (value) =>
    set((state) => {
      if (state.nodeData.find((e) => e.nodeId === value.nodeId)) {
        return {
          nodeData: state.nodeData.map((n) =>
            n.nodeId === value.nodeId ? { ...n, data: value.data } : n
          ),
        };
      }
      return { nodeData: [...state.nodeData, value] };
    }),
  getNodeData: (id) => get().nodeData.find((n) => n.nodeId === id) ?? undefined,
}));
