"use client";

import { ColorVariant } from "@/lib/themes";
import { Sticker } from "@/lib/store";

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

function getFrameY(i: number) {
  return FRAME_START_Y + i * (FRAME_H + FRAME_GAP);
}

function Sprockets({ side, ink }: { side: "left" | "right"; ink: string }) {
  const x = side === "left" ? 22 : STRIP_W - 22 - SPROCKET_W;
  const ys = [36, 106, 176, 246, 316, 386, 456, 526, 596];
  return (
    <>
      {ys.map((y) => (
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
      ))}
    </>
  );
}

function DoodleDecorations({ ink }: { ink: string }) {
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

interface PhotoStripProps {
  color: ColorVariant;
  photos: string[];
  onFrameClick?: (index: number) => void;
  activeSlot?: number;
  stickers?: Sticker[];
  decorationText?: string;
}

export function PhotoStrip({
  color,
  photos,
  onFrameClick,
  activeSlot,
  stickers = [],
  decorationText = "",
}: PhotoStripProps) {
  return (
    <svg
      viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
      style={{ width: "100%", maxWidth: 340, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* strip body */}
      <path
        d={`M18 18 C20 15, ${STRIP_W - 18} 14, ${STRIP_W - 16} 18 C${STRIP_W - 13} 21, ${STRIP_W - 14} ${STRIP_H - 22}, ${STRIP_W - 16} ${STRIP_H - 20} C${STRIP_W - 19} ${STRIP_H - 17}, 20 ${STRIP_H - 18}, 18 ${STRIP_H - 20} C15 ${STRIP_H - 23}, 16 21, 18 18Z`}
        fill={color.bg}
        stroke={color.ink}
        strokeWidth={3.5}
      />

      <Sprockets side="left" ink={color.ink} />
      <Sprockets side="right" ink={color.ink} />

      {/* photo frames */}
      {[0, 1, 2, 3].map((i) => {
        const y = getFrameY(i);
        const hasPhoto = photos[i];
        const isActive = i === activeSlot && !hasPhoto;
        return (
          <g
            key={i}
            onClick={() => onFrameClick?.(i)}
            style={{ cursor: onFrameClick ? "pointer" : "default" }}
          >
            {/* frame background */}
            <path
              d={`M${FRAME_X} ${y} L${FRAME_X + FRAME_W} ${y + 1} L${FRAME_X + FRAME_W - 1} ${y + FRAME_H} L${FRAME_X + 1} ${y + FRAME_H - 1}Z`}
              fill={color.frames[i]}
              stroke="none"
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
                <g
                  transform={`translate(${FRAME_X + FRAME_W / 2 - 16}, ${y + FRAME_H / 2 - 14})`}
                  opacity={isActive ? 0.6 : 0.35}
                >
                  <path
                    d="M4 10 C3 9, 5 8, 12 8 L14 4 C14.5 3, 17.5 3, 18 4 L20 8 C27 8, 29 9, 28 10 L29 24 C29 26, 27 27, 4 27 C3 26, 2 25, 3 24Z"
                    stroke={color.ink}
                    strokeWidth={2}
                    fill="none"
                  />
                  <circle cx={16} cy={17} r={5.5} stroke={color.ink} strokeWidth={1.8} fill="none" />
                </g>
                <text
                  x={FRAME_X + FRAME_W / 2}
                  y={y + FRAME_H / 2 + 24}
                  textAnchor="middle"
                  fill={color.ink}
                  opacity={isActive ? 0.6 : 0.3}
                  fontSize={11}
                  fontFamily="'Gaegu', cursive"
                >
                  {isActive ? "next up!" : "tap to capture"}
                </text>
              </>
            )}

            {/* frame border drawn on top so photos don't cover it */}
            <path
              d={`M${FRAME_X} ${y} L${FRAME_X + FRAME_W} ${y + 1} L${FRAME_X + FRAME_W - 1} ${y + FRAME_H} L${FRAME_X + 1} ${y + FRAME_H - 1}Z`}
              fill="none"
              stroke={isActive ? color.accent : color.ink}
              strokeWidth={3.5}
            />
          </g>
        );
      })}

      {/* open decoration area */}
      {decorationText && (
        <text
          x={STRIP_W / 2}
          y={OPEN_SPACE_Y + 40}
          textAnchor="middle"
          fill={color.ink}
          fontSize={20}
          fontFamily="'Gaegu', cursive"
          fontWeight={700}
        >
          {decorationText}
        </text>
      )}
      {stickers.map((s) => (
        <text
          key={s.id}
          x={FRAME_X + (s.x / 100) * FRAME_W}
          y={OPEN_SPACE_Y + (s.y / 100) * (STRIP_H - OPEN_SPACE_Y - 30)}
          fontSize={s.size}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {s.emoji}
        </text>
      ))}

      <DoodleDecorations ink={color.ink} />
    </svg>
  );
}
