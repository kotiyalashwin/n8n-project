"use client";

import { nodeConfigs } from "@/lib/nodes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent, useState } from "react";
import { CredentialModal } from "../CredentialModal";
import { useCredentialStore } from "@/store/credentials";
import { Button } from "../ui/button";
import { useNodeDataStore } from "@/store/nodedata";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function NodeForm({
  type,
  nodeId,
}: {
  type: string;
  nodeId: string;
}) {
  const config = nodeConfigs[type as keyof typeof nodeConfigs];
  const [credentialModal, setCredentialModal] = useState(false);
  const { credentials } = useCredentialStore();
  const { addNodeData, getNodeData } = useNodeDataStore();
  const [submitting, setSubmitting] = useState(false);
  const savedData = getNodeData(nodeId);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const nodeFormData = config.formFields.map((f) => ({
      name: f.name,
      value: formData.get(f.name) as string,
    }));

    console.log([
      ...nodeFormData,
      {
        name: "credentials",
        value: formData.get("credentials") as string,
      },
    ]);
    //adds to the zustand

    addNodeData({
      nodeId,
      data: [
        ...nodeFormData,
        {
          name: "credentials",
          value: formData.get("credentials") as string,
        },
      ],
    });
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Configuration Saved", {
        classNames: {
          toast: "",
        },
      });
    }, 1000);
  };

  if (!config) return <p>Unknown node type</p>;

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
        <h1 className="text-3xl font-semibold text-foreground mb-2 flex gap-2 items-center">
          <img
            src={`/icons/${type}.svg`}
            alt={config.label}
            className="w-8 h-8"
          />
          {config.label} Configuration
        </h1>

        <div>
          <label htmlFor="credentials" className="text-foreground">
            Credentials:
          </label>
          <Select
            defaultValue={
              savedData?.nodeId === nodeId ? savedData.data.at(-1)?.value : ""
            }
            name="credentials"
            onValueChange={(value) => {
              if (value === "__add_new__") {
                setCredentialModal(true);
                return;
              }
            }}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Credentials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                // somehow make sure its value is not set
                className="text-base cursor-pointer"
                value="__add_new__"
              >
                + Add Credentials
              </SelectItem>
              {credentials.map((c, i) => (
                <SelectItem
                  key={i}
                  value={c.service}
                  className="cursor-pointer text-base"
                >
                  {c.service}-{i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Fields */}
        {config.formFields.map((field, i) => (
          <div className="flex flex-col gap-2">
            <label className="text-foreground" htmlFor={field.label}>
              {field.label}:
            </label>
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              defaultValue={
                savedData?.data.length !== 0 ? savedData?.data[i].value : ""
              }
              placeholder={field.placeholder}
              required
              className="border bg-card text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none shadow-sm"
            />
          </div>
        ))}
        <Button
          className="w-fit"
          variant={"default"}
          type="submit"
          disabled={submitting}
          id="submit_btn"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" /> Submiting
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>

      {credentialModal && (
        <CredentialModal
          service={config.label}
          open={credentialModal}
          credentialFields={config.credentials ? config.credentials : []}
          onOpenChange={setCredentialModal}
        />
      )}
    </div>
  );
}
