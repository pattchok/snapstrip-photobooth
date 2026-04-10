"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

const COMPLIMENTS = [
  "Looking good!",
  "Nailed it!",
  "Gorgeous!",
  "You look amazing!",
  "Stunning!",
  "Obsessed!",
  "Cute overload!",

];
import { useBooth } from "@/lib/store";
import { getColorById } from "@/lib/themes";
import { compositeStrip } from "@/lib/compositeStrip";
import { PhotoStrip } from "@/components/PhotoStrip";
import Link from "next/link";

export default function PreviewPage() {
  const router = useRouter();
  const { state, setCompositeImage } = useBooth();
  const color = getColorById(state.themeId, state.colorId);
  const [isCompositing, setIsCompositing] = useState(true);

  useEffect(() => {
    if (state.photos.length === 0) {
      router.push("/theme");
    }
  }, [state.photos, router]);

  useEffect(() => {
    if (state.photos.length === 0) return;

    setIsCompositing(true);
    compositeStrip(state.photos, color, state.stickers, state.decorationText).then((url) => {
      setCompositeImage(url);
      setIsCompositing(false);
    });
  }, [state.photos, color, setCompositeImage]);

  const headline = useMemo(
    () => COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)],
    [],
  );

  if (state.photos.length === 0) return null;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-4">
      <div className="animate-fade-in w-full max-w-md flex flex-col items-center gap-4">
        <h1 className="font-heading text-2xl font-bold">
          {headline}
        </h1>

        <div style={{ maxWidth: 220 }} className="w-full">
          <PhotoStrip
            color={color}
            photos={state.photos}
            stickers={state.stickers}
            decorationText={state.decorationText}
          />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/camera" className="btn-doodle">
            Retake
          </Link>

          <button
            onClick={() => {
              if (!isCompositing) {
                router.push("/share");
              }
            }}
            disabled={isCompositing}
            className="btn-doodle"
          >
            Looks great!
          </button>
        </div>
      </div>
    </main>
  );
}
