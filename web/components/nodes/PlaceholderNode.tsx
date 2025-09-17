import { useSheetStore } from "@/store/sheetStore";

export const PlaceholderNode = () => {
  const { openSheet } = useSheetStore();
  return (
    <div
      onClick={openSheet}
      className="h-25 text-foreground text-lg p-4 flex flex-col w-25 bg-transparent border border-dashed"
    >
      <p>Add first Node</p>
    </div>
  );
};
