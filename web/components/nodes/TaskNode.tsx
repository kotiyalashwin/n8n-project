import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { TaskNodeData } from "@/app/workflow/[id]/page";
import { Handle, Position } from "@xyflow/react";

const formFiels = [
  { name: "apiKey", type: "text", placeholder: "Telegram API key" },
  { name: "number", type: "text", placeholder: "Your phone number" },
  { name: "chatId", type: "text", placeholder: "Enter chatid" },
];

export const TaskNode = ({ data }: { data: TaskNodeData }) => {
  return (
    <Dialog>
      <div className="relative bg-[#1B1720] text-white p-8 rounded-2xl flex items-center">
        {/* Dialog trigger area */}
        <DialogTrigger asChild>
          <div className="flex items-center space-x-2">
            <Handle type="source" position={Position.Right} />
            <img
              src={`/icons/${data.type}.svg`}
              alt={data.type}
              className="w-16 h-16"
            />
            {data.id !== 2 && <Handle type="target" position={Position.Left} />}
          </div>
        </DialogTrigger>
      </div>

      {/* <DialogTrigger asChild>
        <div className="bg-[#1B1720] text-white p-8 rounded-2xl flex items-center">
          <Handle type="source" position={Position.Right} />
          <img
            src={`/icons/${data.type}.svg`}
            alt={data.type}
            className="w-16 h-16 fill-white"
          />
          {data.id !== 1 && <Handle type="target" position={Position.Left} />}

          <button
            onClick={() => data.addNewNode(data.id)}
            className="ml-2 w-5 h-5 flex items-center justify-center bg-gray-600 text-white text-xs rounded-full hover:bg-gray-700"
          >
            +
          </button>
        </div>
      </DialogTrigger> */}

      <DialogContent className="bg-white ">
        <DialogHeader>
          <DialogTitle>Fill this form</DialogTitle>
        </DialogHeader>
        <div>
          <form className="flex flex-col space-y-4" action="">
            {formFiels.map(({ name, type, placeholder }) => {
              return (
                <input
                  className="placeholder:text-neutral-400 outline-none px-2 py-2 border-black/30 rounded-xl border-2"
                  type={type}
                  placeholder={placeholder}
                  name={name}
                />
              );
            })}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
