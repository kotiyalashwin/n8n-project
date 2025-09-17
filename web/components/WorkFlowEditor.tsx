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
import { useWebSocket } from "@/hooks/useWebSocket";

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
  const { addCredentials } = useCredentialStore();
  const queryClient = useQueryClient();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isInitializingRef = useRef(true);
  const handleExecuteRef = useRef<() => void>(() => {});

  // WebSocket integration
  const { getNodeStatus, clearNodeStatuses, isConnected } =
    useWebSocket(workFlowId);

  // Utility: filter edges to only those whose endpoints exist
  const filterEdgesForExistingNodes = useCallback(
    (edgesToFilter: Edge[], nodesToCheck: Node[]) => {
      const validIds = new Set(nodesToCheck.map((n) => n.id));
      return edgesToFilter.filter(
        (e) =>
          validIds.has(e.source as string) && validIds.has(e.target as string)
      );
    },
    []
  );

  const nodeTypes: NodeTypes = {
    manualNode: (props) => (
      <ManualNode {...props} nodeStatus={getNodeStatus(props.data.id)} />
    ),
    taskNode: (props) => (
      <TaskNode {...props} nodeStatus={getNodeStatus(props.data.id)} />
    ),
    aiNode: (props) => (
      <AiNode {...props} nodeStatus={getNodeStatus(props.data.id)} />
    ),
  };

  const { mutate } = useMutation({
    mutationFn: () => {
      const nodesData = embeddNodeData(nodesRef.current);
      // filter dangling edges before save
      const cleanedEdges = filterEdgesForExistingNodes(
        edgesRef.current,
        nodesRef.current
      );
      return saveWorkflow(workFlowId, nodesData, cleanedEdges);
    },
    onSuccess: () => {
      setIsSaving(false);
      setIsSaved(true);
      toast.success("Workflow saved successfully");
    },
    onError: () => {
      setIsSaving(false);
      toast.error("Failed to save workflow");
    },
  });

  const handleExecute = async () => {
    if (!isSaved) {
      toast.warning("Please save the workflow first before executing");
      return;
    }
    try {
      clearNodeStatuses();
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

  // Always keep ref pointing to the latest handler/state
  useEffect(() => {
    handleExecuteRef.current = handleExecute;
  }, [isSaved]);

  useEffect(() => {
    getWorkflow(workFlowId)
      .then(({ nodesData, credentialData }) => {
        if (nodesData?.nodes?.length) {
          const enhancedNodes = nodesData.nodes.map((node: Node) => ({
            ...node,
            data: {
              ...node.data,
              deleteNode: handleDeleteNode,
              ...(node.type === "manualNode" && {
                executeFlow: () => handleExecuteRef.current(),
              }),
            },
            draggable: true,
          }));
          setNodes((s) => s.concat(enhancedNodes));
          if (nodesData.edges.length > 0) {
            const cleaned = filterEdgesForExistingNodes(
              nodesData.edges,
              enhancedNodes
            );
            setEdges((e) => e.concat(cleaned));
          }
          setIsSaved(true);
        }

        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      })
      .finally(() => {
        isInitializingRef.current = false;
      });
  }, [workFlowId, filterEdgesForExistingNodes]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // When nodes change, drop dangling edges in memory and UI
  useEffect(() => {
    if (nodes.length === 0) return;
    setEdges((prev) => filterEdgesForExistingNodes(prev, nodes));
  }, [nodes, filterEdgesForExistingNodes, setEdges]);

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
        ...(variant === "manualNode" && {
          executeFlow: () => handleExecuteRef.current(),
        }),
      },
      draggable: true,
    };

    setNodes((nds) => [...nds, newNode]);
    setIsSaved(false);
  };

  const handleDeleteNode = (id: string) => {
    setNodes((n) => n.filter((node) => node.id !== id));
    setIsSaved(false);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
      setIsSaved(false);
    },
    [setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      if (!isInitializingRef.current) {
        const hasMeaningful = Array.isArray(changes)
          ? changes.some((c) => c?.type && c.type !== "select")
          : true;
        if (hasMeaningful) setIsSaved(false);
      }
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      if (!isInitializingRef.current) {
        const hasMeaningful = Array.isArray(changes)
          ? changes.some((c) => c?.type && c.type !== "select")
          : true;
        if (hasMeaningful) setIsSaved(false);
      }
    },
    [onEdgesChange]
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
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
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
              setIsSaving(true);
              mutate();
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Workflow"}
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
      </ReactFlow>
    </div>
  );
}
