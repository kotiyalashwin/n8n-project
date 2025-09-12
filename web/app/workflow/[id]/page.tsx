"use client";

import { AiNode } from "@/components/nodes/AiNode";
import { PlaceholderNode } from "@/components/PlaceholderNode";
import { TaskNode } from "@/components/nodes/TaskNode";
import { newNodeParams, TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";
import {
  Background,
  Controls,
  Edge,
  addEdge,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Node,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import { NodeSheet } from "@/components/SheetComponent";

export default function Page(params: Promise<{ id: string }>) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const { isOpen, openSheet, closeSheet } = useSheetStore();
  const nodeTypes: NodeTypes = {
    taskNode: TaskNode,
    aiNode: AiNode,
  };
  const handleAddNode = ({ name, type, variant }: newNodeParams) => {
    const newNodeId = crypto.randomUUID();
    const newNode: Node = {
      id: newNodeId,
      type: variant,
      position: { x: 500 + nodes.length * 50, y: 200 },
      data: {
        name: name || `Node ${nodes.length + 1}`,
        id: newNodeId,
        type: type,
        deleteNode: handleDeleteNode,
        count: nodes.length + 1,
        // variant: variant,
      } as TaskNodeData,
      draggable: true,
    };

    setNodes((nds) => [...nds, newNode]);
  };
  const handleDeleteNode = (id: string) => {
    setNodes((n) => n.filter((node) => node.id !== id));
  };
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className=" w-screen h-screen">
      <ReactFlowProvider>
        <ReactFlow
          style={{ height: "90%" }}
          minZoom={0.8}
          fitView={false}
          deleteKeyCode={null}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodes={nodes}
          edges={edges}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls className="text-black" position="top-left" />
          <Background gap={10} size={0.5} bgColor="#474649" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer">
            {nodes.length === 0 && <PlaceholderNode />}
          </div>

          <NodeSheet
            closeSheet={closeSheet}
            isOpen={isOpen}
            openSheet={openSheet}
            addNewNode={handleAddNode}
          />

          <div
            className="text-[40rem] 
          text-neutral-400/10
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            x8x
          </div>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
