import { Loader } from "lucide-react";

const FullPageSaving = () => {
  return (
    <div
      className="
        fixed inset-0
        bg-background/80
        backdrop-blur-sm
        flex items-center justify-center
        z-50
        flex-col
      "
    >
      <p className="text-3xl text-primary">Saving your creation</p>
      <Loader className="text-primary w-12 h-12 animate-spin" />
    </div>
  );
};

export default FullPageSaving;
