import { useSheetStore } from "@/store/sheetStore";

export const PlaceholderNode = () => {
	const { openSheet } = useSheetStore();
	return (
		<div
			onClick={openSheet}
			className="h-25 text-background text-lg flex items-center px-2 text-center w-25 bg-transparent border border-dashed"
		>
			Add first Node
		</div>
	);
};
