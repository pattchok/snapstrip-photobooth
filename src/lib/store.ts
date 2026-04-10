"use client";

import { createContext, useContext } from "react";

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

export interface BoothState {
  themeId: string;
  colorId: string;
  photos: string[];
  stickers: Sticker[];
  decorationText: string;
  compositeImage: string | null;
}

export interface BoothContextType {
  state: BoothState;
  setThemeId: (id: string) => void;
  setColorId: (id: string) => void;
  setPhotos: (photos: string[]) => void;
  setStickers: (stickers: Sticker[]) => void;
  setDecorationText: (text: string) => void;
  setCompositeImage: (image: string | null) => void;
  reset: () => void;
}

export const defaultState: BoothState = {
  themeId: "classic",
  colorId: "pink",
  photos: [],
  stickers: [],
  decorationText: "",
  compositeImage: null,
};

export const BoothContext = createContext<BoothContextType | null>(null);

export function useBooth(): BoothContextType {
  const ctx = useContext(BoothContext);
  if (!ctx) throw new Error("useBooth must be used within BoothProvider");
  return ctx;
}
