import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
	return (
		<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/5 backdrop-blur-sm">
			<h1>Creating your workspace...</h1>
			<Loader2 className="w-16 h-16 text-primary animate-spin" />
		</div>
	);
}
