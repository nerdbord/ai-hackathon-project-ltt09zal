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
  basicResponse: string;
  setBasicResponse: (value: string) => void;
  detailResponse: string;
  setDetailResponse: (value: string) => void;
  followUpResponse: string;
  setFollowUpResponse: (value: string) => void;
  base64img: string;
  setBase64img: (value: string) => void;
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
  basicResponse: '',
  detailResponse: '',
  followUpResponse: '',
  base64img: '',
  setBasicResponse: (value) => set({ basicResponse: value }),
  setDetailResponse: (value) => set({ detailResponse: value }),
  setFollowUpResponse: (value) => set({ followUpResponse: value }),
  setBase64img: (value) => set({ base64img: value }),
}));
