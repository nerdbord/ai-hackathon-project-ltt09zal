import { create } from 'zustand';

interface StoreProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useStore = create<StoreProps>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));