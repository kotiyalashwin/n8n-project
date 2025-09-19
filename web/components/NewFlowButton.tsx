"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const NewWorkFlow = () => {
  const router = useRouter();
  return (
    <Button
      className="w-full justify-start bg-transparent hover:text-white text-white text-xl border py-8 "
      onClick={() => {
        const redirect = crypto.randomUUID();
        router.push(`/workflow/${redirect}`);
      }}
    >
      + New Workflow
    </Button>
  );
};
