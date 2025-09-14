import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import NodeForm from "../NodeForm";
import { Button } from "../ui/button";
import { TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";
import { CircleX } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const TaskNode = ({ data }: { data: TaskNodeData }) => {
  const { openSheet } = useSheetStore();
  return (
    <Dialog>
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

        <DialogTrigger asChild>
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
        </DialogTrigger>
      </div>

      <DialogContent className="bg-[#474649] border-none sm:w-full sm:h-[85vh] sm:max-w-xl">
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <NodeForm type={data.type} />
      </DialogContent>
    </Dialog>
  );
};
