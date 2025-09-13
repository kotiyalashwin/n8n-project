import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type CredentialModalProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

export const CredentialModal = ({
  open,
  onOpenChange,
}: CredentialModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>
            This is the modal content. You can place forms, text, or anything
            here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
