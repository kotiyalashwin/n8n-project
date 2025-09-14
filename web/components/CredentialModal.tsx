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

  const saveCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(e.currentTarget);
    const credentials = credentialFields.map((f) => ({
      name: f.name,
      value: formData.get(f.name) as string,
    }));

    addCredentials({ service, info: credentials });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#474649] border-none sm:w-full sm:min-h-[60vh] sm:max-h-[85vh] sm:max-w-6xl">
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <form
          onSubmit={saveCredentials}
          className="flex flex-col gap-4"
          action=""
        >
          <div>
            <h1 className="text-red-400 text-xl"> New Credentials</h1>
            <p className="text-white/75">
              Add credentials for the required tool such to enable services.
            </p>
          </div>
          {credentialFields.map((f) => (
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="">
                {f.label}:
              </label>
              <input
                key={f.name}
                type={f.type}
                name={f.name}
                required
                className="border border-red-400/20 bg-[#363538] text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400/70 focus:outline-none shadow-sm"
              />
            </div>
          ))}
          <Button
            className="bg-red-600/50
          hover:text-white
          hover:border-2 w-50 hover:translate-x-1 hover:-translate-y-0.5 hover:border-red-600 hover:bg-transparent border-0 text-white p-4 text-lg"
            variant={"outline"}
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
