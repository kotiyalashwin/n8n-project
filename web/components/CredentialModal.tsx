import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCredentialStore } from "@/store/credentials";
import { Button } from "./ui/button";
import { FormEvent } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type CredentialModalProps = {
  open: boolean;
  service: string;
  onOpenChange: (val: boolean) => void;
  credentialFields: { name: string; type: string; label: string }[] | [];
};

export const CredentialModal = ({
  service,
  open,
  onOpenChange,
  credentialFields,
}: CredentialModalProps) => {
  const { addCredentials } = useCredentialStore();
  const { id } = useParams();

  const saveCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(e.currentTarget);
    const credentials = credentialFields.map((f) => ({
      name: f.name,
      value: formData.get(f.name) as string,
    }));

    addCredentials({ service, info: credentials });
    toast.success("Credentials Saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:w-full sm:min-h-[60vh] sm:max-h-[85vh] sm:max-w-6xl">
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <form
          onSubmit={saveCredentials}
          className="flex flex-col gap-4"
          action=""
        >
          <div>
            <h1 className="text-primary text-xl"> New Credentials</h1>
            <p className="text-muted-foreground">
              Add credentials for the required tool such to enable services.
            </p>
          </div>
          {credentialFields.map((f) => (
            <div className="flex flex-col gap-2">
              <label className="text-foreground" htmlFor="">
                {f.label}:
              </label>
              <input
                key={f.name}
                type={f.type}
                name={f.name}
                required
                className="border bg-card text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none shadow-sm"
              />
            </div>
          ))}
          <Button
            className="w-fit"
            variant={"default"}
            type="submit"
            //onclick => execute task
          >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
