import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
    </div>
  );
}
