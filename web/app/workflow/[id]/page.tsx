"use client";
import { PlaceholderNode } from "@/components/nodes/PlaceholderNode";
import { TaskNode } from "@/components/nodes/TaskNode";
import { Button } from "@/components/ui/button";
import { getDependencyData } from "@/helper/dependency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCallback, useEffect, useState } from "react";

export interface TaskNodeData extends Record<string, unknown> {
  id: number;
  name: string;
  dragging: true;
  type: string;
  variant: "action" | "trigger";
}
const initialNodes = [
  {
    id: "placeholder",
    type: "placeHolder",
    position: { x: 300, y: 200 },
    data: { addNewNode: () => {} }, // will inject later
    draggable: true,
  },
];

export default function Page(params: Promise<{ id: string }>) {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [openDialog, setOpenDialog] = useState(false);
  const [nodeType, setNodeType] = useState("");
  const [nodeName, setNodeName] = useState("");
  const nodeTypes: NodeTypes = {
    taskNode: TaskNode,
    placeHolder: PlaceholderNode,
  };
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === "placeholder" ? { ...n, data: { addNewNode: addNode } } : n
      )
    );
  }, []);
  const addNode = () => setOpenDialog(true);
  const handleAddNode = ({
    name,
    type,
    variant,
  }: {
    name: string;
    type: string;
    variant: string;
  }) => {
    const newNodeId = `node-${nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      type: "taskNode",
      position: { x: 300 + nodes.length * 50, y: 200 },
      data: {
        name: name || `Node ${nodes.length + 1}`,
        id: nodes.length + 1,
        type: type,
        variant: variant,
      },
      draggable: true,
    };

    setNodes((nds) => [
      ...nds.filter((n) => n.id !== "placeholder"),
      newNode,
      nds.find((n) => n.id === "placeholder")!,
    ]);

    setOpenDialog(false);
    setNodeName("");
    setNodeType("taskNode");
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
          <Button
            className="absolute z-10 cursor-pointer"
            onClick={() => {
              const payload = getDependencyData(nodes, edges);
              console.log(payload);
            }}
          >
            Show Dependecny
          </Button>
          <Button
            className="absolute left-50 z-10 cursor-pointer"
            onClick={() => {
              const payload = getDependencyData(nodes, edges);
              console.log({
                nodes: nodes.filter((n) => n.id !== "placeholder"),
                connection: payload,
              });
            }}
          >
            Show Backend Data
          </Button>
        </ReactFlow>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Node</DialogTitle>
            </DialogHeader>

            <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault(); // prevent page reload
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const type = formData.get("type") as string;
                const variant = formData.get("variant") as string;

                if (!name || !type) return; // simple validation

                handleAddNode({ name, type, variant });
                // handleAddNode();
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Node Name"
                className="border px-2 py-1 rounded"
                required
              />
              <select
                name="variant"
                className="border px-2 py-1 rounded"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Variant
                </option>
                <option value="trigger">Trigger</option>
                <option value="action">Action</option>
              </select>
              <select
                name="type"
                className="border px-2 py-1 rounded"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select node type
                </option>
                <option value="form">Form</option>
                <option value="telegram">Telegram Service</option>
                <option value="whatsapp">WhatsApp Service</option>
                <option value="gmail">Gmail Service</option>
              </select>
              <Button type="submit" className="mt-2">
                Add Node
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </ReactFlowProvider>
    </div>
  );
}
