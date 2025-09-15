import { Loader } from "lucide-react";

const FullPageSaving = () => {
  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        backdrop-blur-sm
        flex items-center justify-center
        z-50
        flex-col
      "
    >
      <p className="text-3xl text-orange-500">Saving your creation</p>
      <Loader className="text-red-600 w-12 h-12 animate-spin" />
    </div>
  );
};

export default FullPageSaving;
