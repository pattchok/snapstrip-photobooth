import Link from "next/link";
import Image from "next/image";

function SnapIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#E8456B"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="12" width="36" height="28" rx="4" />
      <path d="M14 12L18 6H30L34 12" />
      <circle cx="24" cy="27" r="8" />
      <circle cx="24" cy="27" r="3" fill="#E8456B" stroke="none" />
    </svg>
  );
}

function StyleIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#F5C842"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="4" width="32" height="40" rx="4" />
      <rect x="14" y="10" width="20" height="12" rx="2" />
      <rect x="14" y="26" width="20" height="12" rx="2" />
      <circle cx="40" cy="8" r="4" fill="#F5C842" stroke="none" />
      <polygon points="8,40 12,34 16,40" fill="#4A9FE8" stroke="none" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#4A9FE8"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="36" cy="12" r="5" />
      <circle cx="12" cy="24" r="5" />
      <circle cx="36" cy="36" r="5" />
      <line x1="16.5" y1="22" x2="31.5" y2="14" />
      <line x1="16.5" y1="26" x2="31.5" y2="34" />
    </svg>
  );
}

function DashedArrow() {
  return (
    <svg
      width="50"
      height="20"
      viewBox="0 0 60 24"
      fill="none"
      className="hidden md:block"
    >
      <line
        x1="0"
        y1="12"
        x2="48"
        y2="12"
        stroke="#2A2A2A"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      <polyline
        points="44,6 52,12 44,18"
        stroke="#2A2A2A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-3">
      <div className="animate-fade-in flex flex-col items-center gap-3 max-w-4xl w-full">
        {/* Title */}
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight text-center">
          SnapStrip
        </h1>
        <p className="text-lg text-center max-w-lg" style={{ color: "#666" }}>
          Your instant photo booth is here! Pick a fun theme, strike
          some poses, and get your cute photo strip!
        </p>

        {/* Camera illustration, centered, clickable */}
        <Link
          href="/theme"
          className="group cursor-pointer"
        >
          <Image
            src="/snapstrip-camera.svg"
            alt="Camera"
            width={300}
            height={220}
            priority
            className="transition-transform group-hover:scale-105 group-hover:rotate-[-2deg]"
          />
        </Link>

        {/* 3-step explainer */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-3">
          <div className="flex flex-col items-center gap-1 w-40">
            <StyleIcon />
            <h3 className="text-xl font-bold">Pick</h3>
            <p className="text-sm text-center" style={{ color: "#666" }}>
              Pick your favorite theme
            </p>
          </div>

          <DashedArrow />

          <div className="flex flex-col items-center gap-1 w-40">
            <SnapIcon />
            <h3 className="text-xl font-bold">Snap</h3>
            <p className="text-sm text-center" style={{ color: "#666" }}>
              Strike 4 poses
            </p>
          </div>

          <DashedArrow />

          <div className="flex flex-col items-center gap-1 w-40">
            <ShareIcon />
            <h3 className="text-xl font-bold">Share</h3>
            <p className="text-sm text-center" style={{ color: "#666" }}>
              Download your strip or send it with a QR code
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
