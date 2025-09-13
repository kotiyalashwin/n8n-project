"use client";

import { nodeConfigs } from "@/lib/nodes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { useState } from "react";
import { CredentialModal } from "./CredentialModal";

export default function NodeForm({ type }: { type: string }) {
  const config = nodeConfigs[type as keyof typeof nodeConfigs];
  const [credentialModal, setCredentialModal] = useState(false);

  if (!config) return <p>Unknown node type</p>;

  return (
    <div className="relative">
      <form className="flex relative flex-col gap-3">
        <Select
          onValueChange={(value) => {
            if (value === "__add_new__") {
              setCredentialModal(true);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add Credentials" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__add_new__"> +Add Credentials</SelectItem>
          </SelectContent>
        </Select>
        {config.formFields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required
            className="border rounded p-2"
          />
        ))}
      </form>
      {credentialModal && (
        <CredentialModal
          open={credentialModal}
          onOpenChange={setCredentialModal}
        />
      )}
    </div>
  );
}
