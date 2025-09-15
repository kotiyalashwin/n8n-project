import { Edge, Node } from "@xyflow/react";
import axios from "axios";
import { embeddNodeData } from "./embeddFormData";

export const saveWorkflow = async (
  workFlowId: string,
  nodes: Node[],
  edges: Edge[]
) => {
  try {
    const finalNodes = embeddNodeData(nodes);
    console.log("nodes", finalNodes);
    console.log("edges", edges);
    const response = await axios.post("http://localhost:8000/workflow/save", {
      id: workFlowId,
      nodes: finalNodes,
      edges,
    });
    const data = await response.data;
    return data.message as string;
  } catch (e) {
    console.log(e);
    throw new Error("Unable to save WorkFlow");
  }
};
