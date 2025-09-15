import { useNodeDataStore } from "@/store/nodedata";
import { Node } from "@xyflow/react";

export const embeddNodeData = (nodes: Node[]) => {
  const nodesData = useNodeDataStore.getState().nodeData;
  // console.log("nodes: \n", nodes);
  // console.log("data: \n", nodesData);
  const finalNodes = nodes.map((n) => {
    const embeddata = nodesData.find((nd) => nd.nodeId === n.id);
    const { deleteNode, executeFlow, count, ...rest } = n.data || {};
    // console.log(rest);
    return {
      id: n.id,
      positon: n.position,
      type: n.type,
      draggable: n.draggable,
      data: {
        ...rest,
        ...{
          formData: embeddata?.data,
        },
      },
    };
  });
  return finalNodes;
};
