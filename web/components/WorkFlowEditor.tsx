"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiNode } from "@/components/nodes/AiNode";
import { ManualNode } from "@/components/nodes/ManualNode";
import { NodeSheet } from "@/components/nodes/NodesSheet";
import { PlaceholderNode } from "@/components/nodes/PlaceholderNode";
import { TaskNode } from "@/components/nodes/TaskNode";
import { Button } from "@/components/ui/button";
import { newNodeParams } from "@/lib/types";
import "@xyflow/react/dist/style.css";
import { useMutation } from "@tanstack/react-query";
import {
	addEdge,
	Background,
	Connection,
	Controls,
	Edge,
	Node,
	NodeTypes,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import axios from "axios";
import { toast } from "sonner";
import { embeddNodeData } from "@/helper/embeddFormData";
import { getWorkflow, saveWorkflow } from "@/helper/http";
import { ProviderWrapper } from "@/helper/Providers";
import { generateRandomString } from "@/helper/randomUUID";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSheetStore } from "@/store/sheetStore";
import FullScreenLoader from "./extras/FullPageLoader";

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
	const nodesRef = useRef<Node[]>([]);
	const edgesRef = useRef<Edge[]>([]);
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const isInitializingRef = useRef(true);
	const handleExecuteRef = useRef<() => void>(() => {});

	// WebSocket integration
	const { getNodeStatus, clearNodeStatuses } = useWebSocket(workFlowId);

	// Utility: filter edges to only those whose endpoints exist
	const filterEdgesForExistingNodes = useCallback(
		(edgesToFilter: Edge[], nodesToCheck: Node[]) => {
			const validIds = new Set(nodesToCheck.map((n) => n.id));
			return edgesToFilter.filter(
				(e) =>
					validIds.has(e.source as string) && validIds.has(e.target as string),
			);
		},
		[],
	);

	const handleDeleteNode = useCallback((id: string) => {
		setNodes((n) => n.filter((node) => node.id !== id));
	}, [setNodes]);

	const handleExecute = useCallback(async () => {
		// if (!isSaved) {
		//   toast.warning("Please save the workflow first before executing");
		//   return;
		// }
		try {
			clearNodeStatuses();
			const response = await axios.post(
				`http://ec2-34-203-28-254.compute-1.amazonaws.com:8000/workflow/execute/${workFlowId}`,
			);
			if (response.status !== 200) {
				toast.error("Execution Failed");
				return;
			}
			toast.success("Execution Successfull");
		} catch {
			toast.error("Execution Failed");
		}
	}, [workFlowId, clearNodeStatuses]);

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
				nodesRef.current,
			);
			return saveWorkflow(workFlowId, nodesData, cleanedEdges);
		},
		onSuccess: () => {
			setIsSaving(false);
			toast.success("Workflow saved successfully");
		},
		onError: () => {
			setIsSaving(false);
			toast.error("Failed to save workflow");
		},
	});

	// Update the ref whenever handleExecute changes
	useEffect(() => {
		handleExecuteRef.current = handleExecute;
	}, [handleExecute]);

	// Load workflow data on component mount
	useEffect(() => {
		getWorkflow(workFlowId)
			.then(({ nodesData }) => {
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
							enhancedNodes,
						);
						setEdges((e) => e.concat(cleaned));
					}
				}
				setTimeout(() => {
					setLoading(false);
				}, 2500);
			})
			.catch((e) => {
				console.error('Failed to load workflow:', e);
				setLoading(false);
			})
			.finally(() => {
				isInitializingRef.current = false;
			});
	}, [workFlowId, filterEdgesForExistingNodes, handleDeleteNode, setNodes, setEdges]);

	// Sync refs with state
	useEffect(() => {
		nodesRef.current = nodes;
	}, [nodes]);

	useEffect(() => {
		edgesRef.current = edges;
	}, [edges]);

	const handleAddNode = useCallback(({ name, type, variant }: newNodeParams) => {
		const newNodeId = generateRandomString(10);
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
	}, [nodes.length, handleDeleteNode, setNodes]);

	const onConnect = useCallback(
		(params: Edge | Connection) => {
			setEdges((eds) => addEdge(params, eds));
		},
		[setEdges],
	);

	// const handleNodesChange = useCallback(
	//        //@ts-ignore
	// 	(changes: any) => {
	// 		onNodesChange(changes);
	// 		if (!isInitializingRef.current) {
	// 			const hasMeaningful = Array.isArray(changes)
	// 				? changes.some((c) => c?.type && c.type !== "select")
	// 				: true;
	// 		}
	// 	},
	// 	[onNodesChange],
	// );
	//
	// const handleEdgesChange = useCallback(
	//        //@ts-ignore
	// 	(changes: any) => {
	// 		onEdgesChange(changes);
	// 		if (!isInitializingRef.current) {
	// 			const hasMeaningful = Array.isArray(changes)
	// 				? changes.some((c) => c?.type && c.type !== "select")
	// 				: true;
	// 			if (hasMeaningful) setIsSaved(false);
	// 		}
	// 	},
	// 	[onEdgesChange],
	// );

	const handleSaveWorkflow = useCallback(() => {
		setIsSaving(true);
		mutate();
	}, [mutate]);

	if (loading) {
		return (
			<div className="relative h-full w-full">
				<FullScreenLoader />
			</div>
		);
	}

	return (
		<div className="w-screen h-screen">
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
				<Background gap={10} size={0.5} bgColor="#1e1e1e" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer">
					{nodes.length === 0 && <PlaceholderNode />}
				</div>

				{nodes.length > 0 && edges.length > 0 && (
					<Button
						className="z-10 absolute left-1/2 top-10 -translate-x-1/2"
						variant={"default"}
						onClick={handleSaveWorkflow}
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
			</ReactFlow>
		</div>
	);
}
