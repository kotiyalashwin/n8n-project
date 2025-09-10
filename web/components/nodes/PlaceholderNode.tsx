import { Handle, Position } from "@xyflow/react";

export const PlaceholderNode = ({
  data,
}: {
  data: { addNewNode: () => void };
}) => {
  return (
    <div
      onClick={data.addNewNode}
      className="relative text-white text-2xl font-bold bg-gray-800 p-4 rounded flex items-center justify-center w-20 h-20 cursor-pointer"
    >
      +
    </div>
  );
};
