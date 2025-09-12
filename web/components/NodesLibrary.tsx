import { nodeConfigs } from "@/lib/nodes";
import { newNodeParams } from "@/lib/types";
import { ChevronRight, CircleX, Cross } from "lucide-react";
import { useState } from "react";

export const NodeLibrary = ({
  addNode,
}: {
  addNode: (data: newNodeParams) => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredNodes = Object.entries(nodeConfigs).filter(([key, config]) =>
    config.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-none rounded-xl ">
      <div className="flex shadow-lg items-center rounded-lg mb-4 px-3 py-2 ">
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-white    placeholder:text-white outline-none"
        />
        <CircleX
          className="fill-white cursor-pointer"
          onClick={() => setSearch("")}
        />
      </div>

      <div className="flex flex-col gap-3">
        {filteredNodes.map(([key, config]) => (
          <div
            key={key}
            className="relative p-3 shadow-sm rounded-lg flex items-center gap-3  cursor-pointer"
          >
            <img
              src={`/icons/${key}.svg`}
              alt={config.label}
              className="w-8 h-8"
            />
            <div>
              <p className="font-semibold text-white">{config.label}</p>
              <p className="text-sm text-white">{config.description}</p>
            </div>
            <div
              onClick={() =>
                addNode({
                  name: config.label,
                  type: key,
                  variant: config.variant,
                })
              }
              className="absolute inset-0 flex items-center justify-end rounded-md  bg-gradient-to-r from-black/10  to-amber-800
                text-white font-bold text-sm opacity-0 hover:opacity-100 transition-opacity"
            >
              <span className="text-white">Add this node</span>
              <ChevronRight />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

//
