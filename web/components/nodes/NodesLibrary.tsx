import { nodeConfigs } from "@/lib/nodes";
import { newNodeParams } from "@/lib/types";
import { ChevronRight, CircleX, } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export const NodeLibrary = ({
	addNode,
}: {
	addNode: (data: newNodeParams) => void;
}) => {
	const [search, setSearch] = useState("");

	const filteredNodes = Object.entries(nodeConfigs).filter(([, config]) =>
		config.label.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="p-4 bg-none rounded-xl ">
			<div className="flex items-center rounded-lg mb-4 px-3 py-2 border bg-card shadow-sm ">
				<input
					type="text"
					placeholder="Search tools..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full text-foreground placeholder:text-muted-foreground outline-none bg-transparent"
				/>
				<CircleX
					className="text-muted-foreground cursor-pointer"
					onClick={() => setSearch("")}
				/>
			</div>

			<div className="flex flex-col gap-3">
				{filteredNodes.length === 0 && <div>Sorry!! node not found. <span className="line-clamp-1">(More nodes coming soon...)</span></div>}
				{filteredNodes.map(([key, config]) => (
					<div
						key={key}
						className="relative p-3 rounded-lg flex items-center gap-3 cursor-pointer border bg-card shadow-xs hover:shadow-sm transition-shadow"
					>
						<Image
							src={`/icons/${key}.svg`}
							alt={config.label}
							className="w-8 h-8"
						/>
						<div>
							<p className="font-semibold text-foreground">{config.label}</p>
							<p className="text-sm w-[75%] text-muted-foreground">
								{config.description}
							</p>
						</div>
						<div
							onClick={() =>
								addNode({
									name: config.label,
									type: key,
									variant: config.variant,
								})
							}
							className="absolute inset-0 flex items-center justify-end rounded-md bg-primary/20 text-primary-foreground font-semibold text-sm opacity-0 hover:opacity-100 transition-opacity pr-3"
						>
							{/* <span className="text-black">Add this node</span> */}
							<ChevronRight size={40} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

//
