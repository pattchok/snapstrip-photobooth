"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBooth } from "@/lib/store";
import { getColorById } from "@/lib/themes";
import { PhotoStrip } from "@/components/PhotoStrip";
import { ShareActions } from "@/components/ShareActions";
import Link from "next/link";

export default function SharePage() {
  const router = useRouter();
  const { state } = useBooth();
  const color = getColorById(state.themeId, state.colorId);
  const imageUrl = state.compositeImage;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!imageUrl) {
      router.push("/theme");
    }
  }, [imageUrl, router]);

  if (!imageUrl) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div
          className="w-10 h-10 border-3 border-t-transparent rounded-full spinner-doodle"
          style={{ borderColor: color.accent, borderTopColor: "transparent" }}
        />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-4">
      <div className="animate-fade-in w-full max-w-md flex flex-col items-center gap-4">
        <h1 className="font-heading text-2xl font-bold">
          Here you go!
        </h1>

        <div style={{ maxWidth: 220 }} className="w-full">
          <PhotoStrip
            color={color}
            photos={state.photos}
            stickers={state.stickers}
            decorationText={state.decorationText}
          />
        </div>

        <ShareActions imageUrl={imageUrl} shareUrl={shareUrl} color={color} />

        <Link href="/theme" className="btn-doodle">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Take more photos!
        </Link>
      </div>
    </main>
  );
}
