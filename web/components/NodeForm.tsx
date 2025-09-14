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
import { CredentialModal } from "./CredentialModal";
import { useCredentialStore } from "@/store/credentials";
import { Button } from "./ui/button";
import { useNodeDataStore } from "@/store/nodedata";

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
  const savedData = getNodeData(nodeId);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
  };

  if (!config) return <p>Unknown node type</p>;

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
        <h1 className="text-3xl font-semibold text-white mb-2 flex gap-2 items-center">
          <img
            src={`/icons/${type}.svg`}
            alt={config.label}
            className="w-8 h-8"
          />
          {config.label} Configuration
        </h1>

        <div>
          <label htmlFor="credentials" className="text-white">
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
            <SelectTrigger className="w-[220px] border border-red-400/20 bg-[#2c2c2c] text-white text-lg rounded-lg shadow-sm focus:ring-2 focus:ring-red-400/70 focus:outline-none">
              <SelectValue placeholder="Select Credentials" />
            </SelectTrigger>
            <SelectContent className="bg-[#2c2c2c] text-white border border-red-400/40">
              <SelectItem
                // somehow make sure its value is not set
                className="text-lg hover:bg-red-400/20 cursor-pointer"
                value="__add_new__"
              >
                + Add Credentials
              </SelectItem>
              {credentials.map((c, i) => (
                <SelectItem
                  key={i}
                  value={c.service}
                  className="hover:bg-red-400/20 cursor-pointer text-lg"
                >
                  {c.service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Fields */}
        {config.formFields.map((field, i) => (
          <div className="flex flex-col gap-2">
            <label className="text-white" htmlFor={field.label}>
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
          Submit
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
