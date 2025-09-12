import { create } from "zustand";

type SheetState = {
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  toggleSheet: () => void;
};

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  openSheet: () => set({ isOpen: true }),
  closeSheet: () => set({ isOpen: false }),
  toggleSheet: () => set((s) => ({ isOpen: !s.isOpen })),
}));
