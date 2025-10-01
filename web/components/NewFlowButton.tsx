"use client";
import { useRouter } from "next/navigation";
import { generateRandomString } from "@/helper/randomUUID";
import { ArrowRight } from "lucide-react";

export const NewWorkFlow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        const redirect = generateRandomString(10);
        router.push(`/workflow/${redirect}`);
      }}
      className={`${className} relative bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium text-base hover:bg-primary/90 transition-all duration-300 group flex items-center gap-2`}
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
      <span className="absolute inset-0 bg-gradient-to-r from-transparent to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    </button>
  );
};
