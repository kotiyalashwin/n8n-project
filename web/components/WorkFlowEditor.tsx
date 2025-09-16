"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { NodeSheet } from "@/components/nodes/NodesSheet";
import { Button } from "@/components/ui/button";
import { ManualNode } from "@/components/nodes/ManualNode";
import { AiNode } from "@/components/nodes/AiNode";
import { PlaceholderNode } from "@/components/nodes/PlaceholderNode";
import { TaskNode } from "@/components/nodes/TaskNode";
import { newNodeParams } from "@/lib/types";
import "@xyflow/react/dist/style.css";
import { useSheetStore } from "@/store/sheetStore";
import {
  Background,
  Controls,
  Edge,
  addEdge,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Node,
  Connection,
} from "@xyflow/react";
import FullScreenLoader from "./extras/FullPageLoader";
import { embeddNodeData } from "@/helper/embeddFormData";
import FullPageSaving from "./extras/FullPageSaving";
import { ProviderWrapper } from "@/helper/Providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkflow, saveWorkflow } from "@/helper/http";
import { toast } from "sonner";
import { useCredentialStore } from "@/store/credentials";
import axios from "axios";

// type WorkFLowEditorProps = {
//   workfowId: string;
//   initialNodes: Node[] | [];
//   initialEdges: Edge[] | [];
// };

export const WorkFlowEditor = ({ workFlowId }: { workFlowId: string }) => {
  return (
    <ProviderWrapper>
      <WorkFlowArea workFlowId={workFlowId} />
    </ProviderWrapper>
  );
};

function WorkFlowArea({ workFlowId }: { workFlowId: string }) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const { isOpen, openSheet, closeSheet } = useSheetStore();
  const [loading, setLoading] = useState(true);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const queryClient = useQueryClient();
  const { addCredentials } = useCredentialStore();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      saveWorkflow(workFlowId, nodesRef.current, edgesRef.current),
    onSuccess(data) {
      toast.success(data);
    },
    onError(e) {
      console.log(e);
      toast.error("Unable to save WorkFlow");
    },
  });

  const nodeTypes: NodeTypes = {
    taskNode: TaskNode,
    aiNode: AiNode,
    manualNode: ManualNode,
  };

  useEffect(() => {
    getWorkflow(workFlowId)
      .then(({ nodesData, credentialData }) => {
        if (nodesData?.nodes?.length > 0 && nodesData?.edges?.length > 0) {
          const enhancedNodes = nodesData.nodes.map((node: Node) => ({
            ...node,
            data: {
              ...node.data,
              deleteNode: handleDeleteNode,
              ...(node.type === "manualNode" && {
                executeFlow: () => handleExecute(),
              }),
            },
            draggable: true,
          }));
          setNodes((s) => s.concat(enhancedNodes));
          setEdges((e) => e.concat(nodesData.edges));
        }
        if (credentialData.length > 0) {
          addCredentials(credentialData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [workFlowId]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);
  const handleExecute = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/workflow/execute/${workFlowId}`
      );
      if (response.status !== 200) {
        toast.error("Execution Failed");
        return;
      }
      toast.success("Execution Successfull");
    } catch {
      toast.error("Execution Failed");
    }
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
        ...(variant === "manualNode" && { executeFlow: () => handleExecute() }),
      },
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

  if (loading) return <FullScreenLoader />;

  return (
    <div className=" w-screen h-screen">
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

        {nodesRef.current.length > 0 && edgesRef.current.length > 0 && (
          <Button
            className="bg-red-600/50
            z-10 absolute 
            left-1/2  top-10 -translate-x-1/2
          hover:text-white
          hover:border-2 hover:border-red-600 hover:bg-transparent border-0 text-white p-4 text-lg"
            variant={"outline"}
            onClick={() => {
              mutate();
            }}
          >
            Save Worflow
          </Button>
        )}

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

        {isPending && <FullPageSaving />}
      </ReactFlow>
    </div>
  );
}
