import { useState, useRef, useCallback, useEffect } from "react";

const THEMES = {
  pink: {
    name: "pink",
    bg: "#FFF0F3",
    frames: ["#FFE0E8", "#FFD1DC", "#FFC0D0", "#FFB0C4"],
    accent: "#E8456B",
    ink: "#2A2A2A",
  },
  yellow: {
    name: "yellow",
    bg: "#FFFDE8",
    frames: ["#FFF3B0", "#FFE98A", "#FFEAA0", "#FFF0C0"],
    accent: "#F5C842",
    ink: "#2A2A2A",
  },
  blue: {
    name: "blue",
    bg: "#EAF4FF",
    frames: ["#D6EDFF", "#C0E0FF", "#B0D8FF", "#C8E4FF"],
    accent: "#4A9FE8",
    ink: "#2A2A2A",
  },
  green: {
    name: "green",
    bg: "#EDFCF5",
    frames: ["#D0F5E8", "#B8EDDA", "#A8E8D0", "#C0F0E0"],
    accent: "#3DBEA0",
    ink: "#2A2A2A",
  },
  purple: {
    name: "purple",
    bg: "#F3EEFF",
    frames: ["#EDE0FF", "#E0D0FF", "#D4C0FF", "#E4D8FF"],
    accent: "#8B6CC1",
    ink: "#2A2A2A",
  },
};

const STRIP_W = 340;
const STRIP_H = 780;
const FRAME_X = 68;
const FRAME_W = 204;
const FRAME_GAP = 12;
const FRAME_H = 128;
const FRAME_START_Y = 30;
const FRAME_COUNT = 4;
const SPROCKET_W = 14;
const SPROCKET_H = 10;
const OPEN_SPACE_Y = FRAME_START_Y + FRAME_COUNT * (FRAME_H + FRAME_GAP) + 20;

function getFrameY(i) {
  return FRAME_START_Y + i * (FRAME_H + FRAME_GAP);
}

function Sprockets({ side, ink }) {
  const x = side === "left" ? 22 : STRIP_W - 22 - SPROCKET_W;
  const ys = [36, 106, 176, 246, 316, 386, 456, 526, 596];
  return ys.map((y) => (
    <rect
      key={`${side}-${y}`}
      x={x}
      y={y}
      width={SPROCKET_W}
      height={SPROCKET_H}
      rx={2.5}
      stroke={ink}
      strokeWidth={2.5}
      fill="none"
    />
  ));
}

function DoodleDecorations({ ink }) {
  return (
    <>
      {/* sparkle lines top right */}
      <line x1={310} y1={8} x2={316} y2={-4} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      <line x1={324} y1={4} x2={332} y2={-2} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      <line x1={320} y1={16} x2={330} y2={14} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      {/* star top left */}
      <path d="M10 12 L13 4 L16 12 L24 15 L16 18 L13 26 L10 18 L2 15Z" fill={ink} />
    </>
  );
}

function PhotoStrip({
  theme = "strawberryMilk",
  photos = [null, null, null, null],
  onFrameClick,
  decorationContent,
}) {
  const t = THEMES[theme] || THEMES.pink;

  return (
    <svg
      viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
      style={{ width: "100%", maxWidth: 340, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* strip body */}
      <path
        d={`M18 18 C20 15, ${STRIP_W - 18} 14, ${STRIP_W - 16} 18 C${STRIP_W - 13} 21, ${STRIP_W - 14} ${STRIP_H - 22}, ${STRIP_W - 16} ${STRIP_H - 20} C${STRIP_W - 19} ${STRIP_H - 17}, 20 ${STRIP_H - 18}, 18 ${STRIP_H - 20} C15 ${STRIP_H - 23}, 16 21, 18 18Z`}
        fill={t.bg}
        stroke={t.ink}
        strokeWidth={3.5}
      />

      <Sprockets side="left" ink={t.ink} />
      <Sprockets side="right" ink={t.ink} />

      {/* photo frames */}
      {[0, 1, 2, 3].map((i) => {
        const y = getFrameY(i);
        const hasPhoto = photos[i];
        return (
          <g
            key={i}
            onClick={() => onFrameClick?.(i)}
            style={{ cursor: "pointer" }}
          >
            {/* frame background */}
            <path
              d={`M${FRAME_X} ${y} L${FRAME_X + FRAME_W} ${y + 1} L${FRAME_X + FRAME_W - 1} ${y + FRAME_H} L${FRAME_X + 1} ${y + FRAME_H - 1}Z`}
              fill={t.frames[i]}
              stroke={t.ink}
              strokeWidth={2.8}
            />

            {/* clipping region for photo */}
            <defs>
              <clipPath id={`frame-clip-${i}`}>
                <rect x={FRAME_X} y={y} width={FRAME_W} height={FRAME_H} />
              </clipPath>
            </defs>

            {hasPhoto ? (
              <image
                href={photos[i]}
                x={FRAME_X}
                y={y}
                width={FRAME_W}
                height={FRAME_H}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#frame-clip-${i})`}
              />
            ) : (
              <>
                {/* camera icon placeholder */}
                <g transform={`translate(${FRAME_X + FRAME_W / 2 - 16}, ${y + FRAME_H / 2 - 14})`} opacity={0.35}>
                  <path
                    d="M4 10 C3 9, 5 8, 12 8 L14 4 C14.5 3, 17.5 3, 18 4 L20 8 C27 8, 29 9, 28 10 L29 24 C29 26, 27 27, 4 27 C3 26, 2 25, 3 24Z"
                    stroke={t.ink}
                    strokeWidth={2}
                    fill="none"
                  />
                  <circle cx={16} cy={17} r={5.5} stroke={t.ink} strokeWidth={1.8} fill="none" />
                </g>
                <text
                  x={FRAME_X + FRAME_W / 2}
                  y={y + FRAME_H / 2 + 24}
                  textAnchor="middle"
                  fill={t.ink}
                  opacity={0.3}
                  fontSize={11}
                  fontFamily="'Nunito', sans-serif"
                >
                  tap to capture
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* open decoration space */}
      {decorationContent && (
        <foreignObject x={FRAME_X} y={OPEN_SPACE_Y} width={FRAME_W} height={STRIP_H - OPEN_SPACE_Y - 30}>
          {decorationContent}
        </foreignObject>
      )}

      <DoodleDecorations ink={t.ink} />
    </svg>
  );
}

/* ─── camera modal ─── */
function CameraModal({ onCapture, onClose, theme }) {
  const t = THEMES[theme] || THEMES.pink;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setReady(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onCapture(dataUrl);
    }, 300);
  }, [onCapture]);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    let n = 3;
    const iv = setInterval(() => {
      n--;
      if (n === 0) {
        clearInterval(iv);
        setCountdown(null);
        capture();
      } else {
        setCountdown(n);
      }
    }, 1000);
  }, [capture]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16,
    }}>
      <div style={{
        position: "relative", borderRadius: 16,
        border: `3.5px solid ${t.ink}`, overflow: "hidden",
        background: "#000", maxWidth: 480, width: "90%",
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", display: "block", transform: "scaleX(-1)" }}
        />
        {countdown && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 96, fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
            color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}>
            {countdown}
          </div>
        )}
        {flash && (
          <div style={{
            position: "absolute", inset: 0, background: "#fff",
            opacity: 0.8, transition: "opacity 0.2s",
          }} />
        )}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {ready && (
          <button
            onClick={startCountdown}
            disabled={countdown !== null}
            style={{
              fontFamily: "'Fredoka', sans-serif", fontSize: 18,
              padding: "12px 32px", borderRadius: 50,
              border: `3px solid ${t.ink}`, background: t.frames[0],
              color: t.ink, cursor: "pointer", fontWeight: 500,
              transform: "translateY(0)", transition: "transform 0.1s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {countdown !== null ? "say cheese!" : "snap!"}
          </button>
        )}
        <button
          onClick={() => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            onClose();
          }}
          style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 16,
            padding: "12px 24px", borderRadius: 50,
            border: `2.5px solid rgba(255,255,255,0.4)`, background: "transparent",
            color: "#fff", cursor: "pointer",
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
}

/* ─── main app ─── */
export default function SnapStrip() {
  const [theme, setTheme] = useState("pink");
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeFrame, setActiveFrame] = useState(null);
  const t = THEMES[theme];

  const handleFrameClick = (index) => {
    setActiveFrame(index);
    setCameraOpen(true);
  };

  const handleCapture = (dataUrl) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[activeFrame] = dataUrl;
      return next;
    });
    setCameraOpen(false);
    setActiveFrame(null);
  };

  const filledCount = photos.filter(Boolean).length;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", padding: "40px 20px",
      fontFamily: "'Nunito', sans-serif", color: t.ink,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Nunito:wght@400;500;600&display=swap" rel="stylesheet" />

      <h1 style={{
        fontFamily: "'Fredoka', sans-serif", fontSize: 36,
        fontWeight: 600, marginBottom: 4, letterSpacing: -0.5,
      }}>
        snapstrip
      </h1>
      <p style={{ opacity: 0.5, fontSize: 14, marginBottom: 24 }}>
        tap a frame to take a photo
      </p>

      {/* theme picker */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
        {Object.entries(THEMES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            style={{
              padding: "8px 16px", borderRadius: 20,
              border: key === theme ? `3px solid ${val.accent}` : `2.5px solid ${val.ink}`,
              background: val.bg, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", fontSize: 13,
              fontWeight: key === theme ? 600 : 400,
              color: val.ink, transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{
              width: 12, height: 12, borderRadius: "50%",
              background: val.accent, border: `2px solid ${val.ink}`,
              display: "inline-block",
            }} />
            {val.name}
          </button>
        ))}
      </div>

      {/* the strip */}
      <PhotoStrip
        theme={theme}
        photos={photos}
        onFrameClick={handleFrameClick}
        decorationContent={
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.25, fontFamily: "'Fredoka', sans-serif",
              fontSize: 13, color: t.ink, textAlign: "center",
              padding: 12,
            }}
          >
            your doodles here
          </div>
        }
      />

      {/* status */}
      <p style={{ marginTop: 20, fontSize: 14, opacity: 0.5 }}>
        {filledCount === 0
          ? "tap any frame to start"
          : filledCount < 4
          ? `${filledCount}/4 photos taken`
          : "all done! looking great"}
      </p>

      {filledCount > 0 && (
        <button
          onClick={() => setPhotos([null, null, null, null])}
          style={{
            marginTop: 12, padding: "8px 20px", borderRadius: 20,
            border: `2.5px solid ${t.ink}`, background: "transparent",
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            fontSize: 13, color: t.ink,
          }}
        >
          start over
        </button>
      )}

      {cameraOpen && (
        <CameraModal
          theme={theme}
          onCapture={handleCapture}
          onClose={() => { setCameraOpen(false); setActiveFrame(null); }}
        />
      )}
    </div>
  );
}