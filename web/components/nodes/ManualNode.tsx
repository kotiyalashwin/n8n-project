import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { CircleX } from "lucide-react";
import { Button } from "../ui/button";
import { TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";

interface ManualNodeData extends TaskNodeData {
  executeFlow: () => void;
}

export const ManualNode = ({ data }: { data: ManualNodeData }) => {
  const { openSheet } = useSheetStore();
  return (
    <div className="relative bg-[#1B1720] text-white p-8 rounded-2xl flex items-center">
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
        >
          Execute Worflow
        </Button>
      </NodeToolbar>

      <div className="flex items-center space-x-2">
        <Handle type="source" position={Position.Right} />
        <img
          src={`/icons/${data.type}.svg`}
          alt={data.type}
          className="w-16 h-16"
        />
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
