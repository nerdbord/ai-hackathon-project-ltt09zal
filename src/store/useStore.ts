import { create } from 'zustand';

interface StoreProps {
  open: boolean;
  startOcr: boolean;
  textOcr: string;
  initCamera: boolean;
  currApiKey: number;
  setOpen: (open: boolean) => void;
  setStartOcr: (value: boolean) => void;
  setTextOcr: (value: string) => void;
  setInitCamera: (value: boolean) => void;
  setCurrApiKey: (value: number) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export const useStore = create<StoreProps>((set) => ({
  open: false,
  startOcr: false,
  textOcr: '',
  initCamera: false,
  currApiKey: 0,
  setOpen: (value) => set({ open: value }),
  setStartOcr: (value) => set({ startOcr: value }),
  setTextOcr: (value) => set({ textOcr: value }),
  setInitCamera: (value) => set({ initCamera: value }),
  setCurrApiKey: (value) => set({ currApiKey: value }),
  imageUrl: '',
  setImageUrl: (url) => set({ imageUrl: url }),
}));
