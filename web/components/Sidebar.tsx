"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewWorkFlow } from "@/components/NewFlowButton";
import { HomeIcon } from "lucide-react";

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="h-screen  border-r bg-card/30 backdrop-blur-sm sticky top-0 left-0 p-4 flex flex-col gap-3">
			<div className="px-2 py-1.5 text-5xl font-semibold text-muted-foreground mb-10">
				x8x
			</div>
			<div className="">
				<NewWorkFlow />
			</div>
			<Link href="/" className={`${pathname === "/" ? "border border-accent" : " hover:border-accent hover:border-2"} w-full flex gap-2 p-4 rounded-md  items-center`}>

				<HomeIcon size={30} />
				<p className="text-lg">HOME</p>

			</Link>

			<div className="mt-auto text-xs text-muted-foreground px-2">v1.0</div>
		</aside>
	);
}
