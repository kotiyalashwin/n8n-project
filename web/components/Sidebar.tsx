"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewWorkFlow } from "@/components/NewFlowButton";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-80 border-r bg-card/30 backdrop-blur-sm sticky top-0 left-0 p-4 flex flex-col gap-3">
      <div className="px-2 py-1.5 text-5xl font-semibold text-muted-foreground mb-10">
        x8x-me
      </div>
      <div className="">
        <NewWorkFlow />
      </div>
      <Link href="/" className="w-full">
        <Button
          variant={pathname === "/" ? "outline" : "ghost"}
          className={`${
            pathname === "/" ? "border border-b-blue-500" : ""
          } w-full justify-start text-md`}
        >
          Home
        </Button>
      </Link>

      <div className="mt-auto text-xs text-muted-foreground px-2">v1.0</div>
    </aside>
  );
}
