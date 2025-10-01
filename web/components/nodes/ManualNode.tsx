import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { CircleX, } from "lucide-react";
import { Button } from "../ui/button";
import { TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";
import { NodeStatusUpdate } from "@/hooks/useWebSocket";
import Image from "next/image";
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
		if (!nodeStatus) return "border-4";

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
			className={`relative bg-card text-card-foreground p-8 rounded-2xl flex items-center transition-all duration-300  ${getStatusStyles()}`}
		>
			<NodeToolbar isVisible={true} position={Position.Top}>
				<CircleX
					className="text-accent"
					onClick={() => data.deleteNode(data.id)}
				/>
			</NodeToolbar>
			<NodeToolbar isVisible={true} position={Position.Right}>
				<Button
					className="h-10 w-10 text-lg border border-accent bg-transparent hover:text-white text-white"
					variant={"default"}
					onClick={() => {
						openSheet();
					}}
				>
					+
				</Button>
			</NodeToolbar>
			<NodeToolbar isVisible={true} position={Position.Left}>
				<Button
					className="px-4"
					variant={"default"}
					onClick={data.executeFlow}
					disabled={nodeStatus?.status === "processing"}
				>
					{nodeStatus?.status === "processing"
						? "Executing..."
						: "Execute Worflow"}
				</Button>
			</NodeToolbar>

			<div className="flex items-center space-x-2">
				<Handle type="source" style={{ width: '10px', height: '10px' }} position={Position.Right} />
				<div className="flex items-center space-x-2">
					<Image
						src={`/icons/${data.type}.svg`}
						alt={data.type}
						width={64}
						height={64}
						// className="w-16 h-16"
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
