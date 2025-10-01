import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "../ui/dialog";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import NodeForm from "./NodeForm";
import { Button } from "../ui/button";
import { TaskNodeData } from "@/lib/types";
import { useSheetStore } from "@/store/sheetStore";
import { CircleX } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { NodeStatusUpdate } from "@/hooks/useWebSocket";
import Image from "next/image";
interface TaskNodeProps {
	data: TaskNodeData;
	nodeStatus?: NodeStatusUpdate;
}

export const TaskNode = ({ data, nodeStatus }: TaskNodeProps) => {
	const { openSheet } = useSheetStore();

	const getStatusStyles = () => {
		if (!nodeStatus) return "border-4";

		switch (nodeStatus.status) {
			case "processing":
				return "border border-yellow-400 shadow-lg shadow-yellow-400/20";
			case "completed":
				return "border border-green-400 shadow-lg shadow-green-400/20";
			case "error":
				return "border border-red-400 shadow-lg shadow-red-400/20";
			default:
				return "";
		}
	};

	return (
		<Dialog>
			<div
				className={`relative bg-card  text-card-foreground p-8 rounded-2xl flex items-center transition-all duration-300 ${getStatusStyles()}`}
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
							console.log("clicked");
							openSheet();
						}}
					>
						+
					</Button>
				</NodeToolbar>

				<DialogTrigger asChild>
					<div className="flex items-center space-x-2">
						<Handle type="source" style={{ width: '10px', height: '10px' }} position={Position.Right} />
						<div className="flex items-center space-x-2">
							<Image
								src={`/icons/${data.type}.svg`}
								alt={data.type}
								width={64}
								height={64}
							/>
						</div>
						{data.type !== "manual" && (
							<Handle
								type="target"
								style={{ width: '10px', height: '10px' }}
								isConnectableStart={false}
								position={Position.Left}
							/>
						)}
					</div>
				</DialogTrigger>
			</div>

			<DialogContent className="sm:w-full  sm:max-w-xl">
				<VisuallyHidden>
					<DialogTitle></DialogTitle>
				</VisuallyHidden>
				<NodeForm type={data.type} nodeId={data.id} />
			</DialogContent>
		</Dialog>
	);
};
