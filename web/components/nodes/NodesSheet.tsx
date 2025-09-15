import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { newNodeParams } from "@/lib/types";
import { NodeLibrary } from "./NodesLibrary";

export const NodeSheet = ({
  isOpen,
  openSheet,
  addNewNode,
  closeSheet,
}: {
  isOpen: boolean;
  openSheet: () => void;
  addNewNode: (data: newNodeParams) => void;
  closeSheet: () => void;
}) => {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => (value ? openSheet() : closeSheet())}
    >
      <SheetContent className="bg-[#434343] ease-in-out ">
        <SheetHeader>
          <SheetTitle className="text-red-500 text-lg">
            Explore all tools
          </SheetTitle>
          <SheetDescription className="text-white">
            x8x provides various tools for your workflows
          </SheetDescription>
          <div>
            {/* <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault(); // prevent page reload
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const type = formData.get("type") as string;
                const variant = formData.get("variant") as string;

                if (!name || !type) return; // simple validation

                data.addNewNode({ name, type, variant });
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Node Name"
                className="border px-2 py-1 rounded"
                required
              />
              <select
                name="variant"
                className="border px-2 py-1 rounded"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Variant
                </option>
                <option value="trigger">Trigger</option>
                <option value="action">Action</option>
                <option value="conditional">Conditional</option>
              </select>
              <select
                name="type"
                className="border px-2 py-1 rounded"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select node type
                </option>
                <option value="form">Form</option>
                <option value="telegram">Telegram Service</option>
                <option value="whatsapp">WhatsApp Service</option>
                <option value="gmail">Gmail Service</option>
              </select>
              <Button type="submit" className="mt-2">
                Add Node
              </Button>
            </form> */}

            <NodeLibrary addNode={addNewNode} />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
