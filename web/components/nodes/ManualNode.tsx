import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { CircleX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";
import { NodeStatusUpdate } from "@/hooks/useWebSocket";

interface ManualNodeData extends TaskNodeData {
  executeFlow: () => void;
}

interface ManualNodeProps {
  data: ManualNodeData;
  nodeStatus?: NodeStatusUpdate;
}

export const ManualNode = ({ data, nodeStatus }: ManualNodeProps) => {
  const { openSheet } = useSheetStore();

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
    <div
      className={`relative bg-[#1B1720] text-white p-8 rounded-2xl flex items-center transition-all duration-300 ${getStatusStyles()}`}
    >
      <NodeToolbar isVisible={true} position={Position.Top}>
        <CircleX
          className="text-white"
          onClick={() => data.deleteNode(data.id)}
        />
      </NodeToolbar>
      <NodeToolbar isVisible={true} position={Position.Right}>
        <Button
          className="bg-white p-4 h-10 w-10"
          variant={"outline"}
          onClick={() => {
            console.log("clicked");
            openSheet();
          }}
        >
          +
        </Button>
      </NodeToolbar>
      <NodeToolbar isVisible={true} position={Position.Left}>
        <Button
          className="bg-red-600/50
          hover:text-white
          hover:border-2 hover:border-red-600 hover:bg-transparent border-0 text-white p-4 text-lg"
          variant={"outline"}
          onClick={data.executeFlow}
          disabled={nodeStatus?.status === "processing"}
        >
          {nodeStatus?.status === "processing"
            ? "Executing..."
            : "Execute Worflow"}
        </Button>
      </NodeToolbar>

      <div className="flex items-center space-x-2">
        <Handle type="source" position={Position.Right} />
        <div className="flex items-center space-x-2">
          <img
            src={`/icons/${data.type}.svg`}
            alt={data.type}
            className="w-16 h-16"
          />
        </div>
        {data.count !== 1 && (
          <Handle
            type="target"
            isConnectableStart={false}
            position={Position.Left}
          />
        )}
      </div>
    </div>
  );
};
