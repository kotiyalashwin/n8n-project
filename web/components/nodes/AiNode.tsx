import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import NodeForm from "./NodeForm";
import { TaskNodeData } from "@/lib/types";
import { CircleX } from "lucide-react";
import { NodeStatusUpdate } from "@/hooks/useWebSocket";
import Image from "next/image";

interface AiNodeProps {
  data: TaskNodeData;
  nodeStatus?: NodeStatusUpdate;
}

export const AiNode = ({ data, nodeStatus }: AiNodeProps) => {
  const getStatusStyles = () => {
    if (!nodeStatus) return "";

    switch (nodeStatus.status) {
      case "processing":
        return "border-2 border-yellow-400 shadow-lg shadow-yellow-400/20";
      case "completed":
        return "border-2 border-green-400 shadow-lg shadow-green-400/20";
      case "error":
        return "border-2 border-red-400 shadow-lg shadow-red-400/20";
      default:
        return "";
    }
  };

  return (
    <Dialog>
      <div
        className={`relative bg-transparent  border-2 border-dashed px-4 py-2 text-white p-8 flex items-center transition-all duration-300 ${getStatusStyles()}`}
      >
        <NodeToolbar isVisible={true} position={Position.Top}>
          <CircleX
            className="text-white"
            onClick={() => data.deleteNode(data.id)}
          />
        </NodeToolbar>

        <DialogTrigger asChild>
          <div className="flex w-full items-center justify-evenly">
            <Handle type="source" position={Position.Right} />
            <div className="flex items-center space-x-2">
              <Image
                src={`/icons/${data.type}.svg`}
                alt={data.type}
                width={64}
                height={64}
                className=" fill-accent justify-center-safe"
              />
            </div>
            <span className="text-xl"> AI Agent</span>

            {data.count !== 1 && (
              <Handle type="target" position={Position.Left} />
            )}
          </div>
        </DialogTrigger>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill this form</DialogTitle>
        </DialogHeader>
        <div>
          <NodeForm nodeId={data.id} type={data.type} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
