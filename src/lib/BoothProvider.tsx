"use client";

import { useState, useCallback, ReactNode } from "react";
import { BoothContext, BoothState, Sticker, defaultState } from "./store";

export function BoothProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BoothState>(defaultState);

  const setThemeId = useCallback(
    (id: string) => setState((s) => ({ ...s, themeId: id })),
    [],
  );
  const setColorId = useCallback(
    (id: string) => setState((s) => ({ ...s, colorId: id })),
    [],
  );
  const setPhotos = useCallback(
    (photos: string[]) => setState((s) => ({ ...s, photos })),
    [],
  );
  const setStickers = useCallback(
    (stickers: Sticker[]) => setState((s) => ({ ...s, stickers })),
    [],
  );
  const setDecorationText = useCallback(
    (text: string) => setState((s) => ({ ...s, decorationText: text })),
    [],
  );
  const setCompositeImage = useCallback(
    (image: string | null) => setState((s) => ({ ...s, compositeImage: image })),
    [],
  );
  const reset = useCallback(() => setState(defaultState), []);

  return (
    <BoothContext.Provider
      value={{ state, setThemeId, setColorId, setPhotos, setStickers, setDecorationText, setCompositeImage, reset }}
    >
      {children}
    </BoothContext.Provider>
  );
}
