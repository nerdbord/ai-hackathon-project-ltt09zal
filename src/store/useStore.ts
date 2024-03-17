import { create } from 'zustand';

interface StoreProps {
  open: boolean;
  startOcr: boolean;
  textOcr: string;
  initCamera: boolean;//for future use
  setOpen: (open: boolean) => void;
  setStartOcr: (value: boolean) => void;
  setTextOcr: (value: string) => void;
  setInitCamera: (value: boolean) => void; //for future use
}

export const useStore = create<StoreProps>((set) => ({
  open: false,
  startOcr: false,
  textOcr: '',
  initCamera: false,//for future use
  setOpen: (value) => set({ open: value }),
  setStartOcr: (value) => set({ startOcr: value }),
  setTextOcr: (value) => set({ textOcr: value }),
  setInitCamera: (value) => set({ initCamera: value }),//for future use
}));
