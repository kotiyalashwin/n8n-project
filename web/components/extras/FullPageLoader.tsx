import { Loader2 } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#474649] bg-opacity-50">
      <Loader2 className="w-16 h-16 text-white animate-spin" />
    </div>
  );
}
