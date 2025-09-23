"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateRandomString } from "@/helper/randomUUID";

export const NewWorkFlow = () => {
	const router = useRouter();
	return (
		<Button
			className="w-full justify-start bg-transparent hover:text-white text-foreground text-lg border py-8 "
			onClick={() => {
				const redirect = generateRandomString(10);
				router.push(`/workflow/${redirect}`);
			}}
		>
			+ New
		</Button>
	);
};
