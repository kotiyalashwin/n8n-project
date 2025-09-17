import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import NodeForm from "./NodeForm";
import { Button } from "../ui/button";
import { TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";
import { CircleX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { NodeStatusUpdate } from "@/hooks/useWebSocket";

interface TaskNodeProps {
  data: TaskNodeData;
  nodeStatus?: NodeStatusUpdate;
}

export const TaskNode = ({ data, nodeStatus }: TaskNodeProps) => {
  const { openSheet } = useSheetStore();

  const getStatusStyles = () => {
    if (!nodeStatus) return "";
    
    switch (nodeStatus.status) {
      case 'processing':
        return "border-2 border-yellow-400 shadow-lg shadow-yellow-400/20";
      case 'completed':
        return "border-2 border-green-400 shadow-lg shadow-green-400/20";
      case 'error':
        return "border-2 border-red-400 shadow-lg shadow-red-400/20";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    if (!nodeStatus) return null;
    
    switch (nodeStatus.status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <div className={`relative bg-[#1B1720] text-white p-8 rounded-2xl flex items-center transition-all duration-300 ${getStatusStyles()}`}>
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

        <DialogTrigger asChild>
          <div className="flex items-center space-x-2">
            <Handle type="source" position={Position.Right} />
            <div className="flex items-center space-x-2">
              <img
                src={`/icons/${data.type}.svg`}
                alt={data.type}
                className="w-16 h-16"
              />
              {getStatusIcon()}
            </div>
            {data.count !== 1 && (
              <Handle
                type="target"
                isConnectableStart={false}
                position={Position.Left}
              />
            )}
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className="bg-[#474649] border-none sm:w-full sm:h-[85vh] sm:max-w-xl">
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <NodeForm type={data.type} nodeId={data.id} />
      </DialogContent>
    </Dialog>
  );
};
