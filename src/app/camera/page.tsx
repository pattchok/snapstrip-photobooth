"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useBooth } from "@/lib/store";
import { getColorById } from "@/lib/themes";
import { useCamera } from "@/lib/useCamera";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { PhotoStrip } from "@/components/PhotoStrip";
import Link from "next/link";

type CameraState = "init" | "ready" | "countdown" | "flash" | "breather" | "done";

export default function CameraPage() {
  const router = useRouter();
  const { state, setPhotos } = useBooth();
  const color = getColorById(state.themeId, state.colorId);
  const totalPhotos = 4;

  const {
    videoRef,
    isReady,
    error,
    permissionState,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const [cameraState, setCameraState] = useState<CameraState>("init");
  const [countdown, setCountdown] = useState(3);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const capturedRef = useRef<string[]>([]);
  const startCountdownRef = useRef<() => void>(() => {});

  const startCountdown = useCallback(() => {
    setCameraState("countdown");
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        const photo = capturePhoto();
        if (photo) {
          setShowFlash(true);
          setCameraState("flash");

          const newPhotos = [...capturedRef.current, photo];
          capturedRef.current = newPhotos;
          setCapturedPhotos(newPhotos);

          setTimeout(() => {
            setShowFlash(false);

            if (newPhotos.length >= totalPhotos) {
              setCameraState("done");
              setPhotos(newPhotos);
              stopCamera();
              setTimeout(() => {
                router.push("/preview");
              }, 800);
            } else {
              setCameraState("breather");
              setTimeout(() => {
                startCountdownRef.current();
              }, 2000);
            }
          }, 300);
        }
      }
    }, 1000);
  }, [capturePhoto, totalPhotos, setPhotos, stopCamera, router]);

  startCountdownRef.current = startCountdown;

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    if (isReady && cameraState === "init") {
      setCameraState("ready");
    }
  }, [isReady, cameraState]);

  // Permission screen
  if (permissionState === "prompt" && !isReady) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="animate-fade-in flex flex-col items-center gap-6 text-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
          >
            <rect x="15" y="35" width="90" height="65" rx="10" stroke="#2A2A2A" strokeWidth="3" />
            <path d="M40 35L48 20H72L80 35" stroke="#2A2A2A" strokeWidth="3" />
            <circle cx="60" cy="65" r="20" stroke="#2A2A2A" strokeWidth="3" />
            <circle cx="52" cy="60" r="4" fill="#2A2A2A" />
            <circle cx="68" cy="60" r="4" fill="#2A2A2A" />
            <circle cx="53" cy="58" r="1.5" fill="white" />
            <circle cx="69" cy="58" r="1.5" fill="white" />
            <path d="M54 70 Q60 76 66 70" stroke="#2A2A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <h2 className="font-heading text-2xl font-bold">
            Say cheese!
          </h2>
          <p className="text-gray-500 max-w-sm">
            Just need your camera for the photo magic. Allow access when your browser asks!
          </p>
          <div className="spinner-doodle w-8 h-8 border-3 border-ink border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  // Error screen
  if (error || permissionState === "denied") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="animate-fade-in flex flex-col items-center gap-6 text-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E8456B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h2 className="font-heading text-2xl font-bold">
            Oops, camera blocked
          </h2>
          <p className="text-gray-500 max-w-sm">
            {error || "Looks like camera access was denied. Check your browser settings and try again!"}
          </p>
          <button
            onClick={() => {
              setCameraState("init");
              startCamera();
            }}
            className="btn-doodle"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-4">
      <div className="animate-fade-in w-full max-w-5xl flex flex-col items-center gap-3">
        {/* Header */}
        <div className="w-full">
          <Link
            href="/theme"
            className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity"
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
            Change theme
          </Link>
          <h1 className="font-heading text-xl font-bold">
            {["Smile :D", "Now a silly one!", "Ok be serious...", "Grand finale!"][Math.min(capturedPhotos.length, 3)]}
          </h1>
        </div>

        {/* Main area: camera + strip side by side on desktop */}
        <div className="flex gap-4 w-full" style={{ height: "min(75vh, 560px)" }}>
          {/* Camera viewport */}
          <div className="flex-1 flex flex-col gap-2">
            <div
              className="relative w-full overflow-hidden rounded-xl border-[3px] flex-1"
              style={{
                borderColor: color.accent,
                aspectRatio: "204/128",
              }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
                playsInline
                muted
                autoPlay
              />

              <div
                className="absolute inset-0 pointer-events-none border-[6px] rounded-lg"
                style={{ borderColor: color.accent + "30" }}
              />

              {cameraState === "countdown" && (
                <CountdownOverlay number={countdown} accentColor={color.accent} />
              )}

              {showFlash && (
                <div className="absolute inset-0 bg-white flash-overlay z-30" />
              )}

              {cameraState === "done" && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
                  <div
                    className="font-heading text-4xl font-bold countdown-number"
                    style={{
                      color: "white",
                      textShadow: "3px 3px 0px #2A2A2A",
                    }}
                  >
                    Perfect!
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center mt-3 h-10">
              {cameraState === "ready" && (
                <button
                  onClick={startCountdown}
                  className="btn-doodle"
                >
                  Say cheese! 🧀
                </button>
              )}
            </div>
          </div>

          {/* Strip preview (visible on desktop) */}
          <div className="hidden lg:flex w-[170px] shrink-0 self-stretch">
            <PhotoStrip
              color={color}
              photos={capturedPhotos}
              activeSlot={capturedPhotos.length}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
