"use client";

import { useRouter } from "next/navigation";
import { useBooth } from "@/lib/store";
import { getThemeById, getColorById } from "@/lib/themes";
import { PhotoStrip } from "@/components/PhotoStrip";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const { state, setThemeId, setColorId } = useBooth();
  const theme = getThemeById(state.themeId);
  const color = getColorById(state.themeId, state.colorId);

  return (
    <main className="flex flex-1 flex-col items-center px-6 pt-6 pb-2">
      <div className="animate-fade-in w-full max-w-md flex flex-col items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity self-start"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
        <h1 className="font-heading text-lg font-bold self-start mb-1">
          Pick your favorite theme
        </h1>

        <h2 className="font-heading text-base font-bold opacity-60 mb-2">
          {theme.name}
        </h2>

        {/* Strip preview centered */}
        <div style={{ maxWidth: 200 }} className="w-full">
          <PhotoStrip
            color={color}
            photos={[]}
          />
        </div>

        {/* Color picker dots */}
        <div className="flex gap-3 mt-3">
          {theme.colors.map((c) => {
            const isActive = c.id === state.colorId;
            return (
              <button
                key={c.id}
                onClick={() => setColorId(c.id)}
                className="w-7 h-7 rounded-full border-[2px] transition-all"
                style={{
                  backgroundColor: c.accent,
                  borderColor: isActive ? "#2A2A2A" : c.accent,
                  transform: isActive ? "scale(1.25)" : "scale(1)",
                  boxShadow: isActive ? "0 0 0 2px #fff, 0 0 0 4px #2A2A2A" : "none",
                }}
                title={c.name}
              />
            );
          })}
        </div>

        <button
          onClick={() => router.push("/camera")}
          className="btn-doodle mt-5"
        >
          <svg
            width="20"
            height="20"
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
          Let&apos;s shoot!
        </button>
      </div>
    </main>
  );
}
