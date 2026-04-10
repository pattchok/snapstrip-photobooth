import { ColorVariant } from "./themes";
import { Sticker } from "./store";

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

function sprocketsSvg(side: "left" | "right", ink: string): string {
  const x = side === "left" ? 22 : STRIP_W - 22 - SPROCKET_W;
  const ys = [36, 106, 176, 246, 316, 386, 456, 526, 596];
  return ys
    .map(
      (y) =>
        `<rect x="${x}" y="${y}" width="${SPROCKET_W}" height="${SPROCKET_H}" rx="2.5" stroke="${ink}" stroke-width="2.5" fill="none"/>`,
    )
    .join("");
}

function doodleDecorationsSvg(ink: string): string {
  return `
    <line x1="310" y1="8" x2="316" y2="-4" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
    <line x1="324" y1="4" x2="332" y2="-2" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
    <line x1="320" y1="16" x2="330" y2="14" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 12 L13 4 L16 12 L24 15 L16 18 L13 26 L10 18 L2 15Z" fill="${ink}"/>
  `;
}

function buildStripSvg(
  photos: string[],
  color: ColorVariant,
  stickers: Sticker[],
  decorationText: string,
): string {
  const bodyPath = `M18 18 C20 15, ${STRIP_W - 18} 14, ${STRIP_W - 16} 18 C${STRIP_W - 13} 21, ${STRIP_W - 14} ${STRIP_H - 22}, ${STRIP_W - 16} ${STRIP_H - 20} C${STRIP_W - 19} ${STRIP_H - 17}, 20 ${STRIP_H - 18}, 18 ${STRIP_H - 20} C15 ${STRIP_H - 23}, 16 21, 18 18Z`;

  let framesSvg = "";
  for (let i = 0; i < 4; i++) {
    const y = getFrameY(i);
    const framePath = `M${FRAME_X} ${y} L${FRAME_X + FRAME_W} ${y + 1} L${FRAME_X + FRAME_W - 1} ${y + FRAME_H} L${FRAME_X + 1} ${y + FRAME_H - 1}Z`;

    framesSvg += `<path d="${framePath}" fill="${color.frames[i]}" stroke="none"/>`;
    framesSvg += `<defs><clipPath id="frame-clip-${i}"><rect x="${FRAME_X}" y="${y}" width="${FRAME_W}" height="${FRAME_H}"/></clipPath></defs>`;

    if (photos[i]) {
      framesSvg += `<image href="${photos[i]}" x="${FRAME_X}" y="${y}" width="${FRAME_W}" height="${FRAME_H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#frame-clip-${i})"/>`;
    }
    // border on top so photos don't cover it
    framesSvg += `<path d="${framePath}" fill="none" stroke="${color.ink}" stroke-width="3.5"/>`;
  }

  let decorationSvg = "";
  if (decorationText) {
    decorationSvg += `<text x="${STRIP_W / 2}" y="${OPEN_SPACE_Y + 40}" text-anchor="middle" fill="${color.ink}" font-size="20" font-family="'Gaegu', cursive" font-weight="700">${escapeXml(decorationText)}</text>`;
  }
  for (const s of stickers) {
    const sx = FRAME_X + (s.x / 100) * FRAME_W;
    const sy = OPEN_SPACE_Y + (s.y / 100) * (STRIP_H - OPEN_SPACE_Y - 30);
    decorationSvg += `<text x="${sx}" y="${sy}" font-size="${s.size}" text-anchor="middle" dominant-baseline="central">${s.emoji}</text>`;
  }

  return `<svg viewBox="0 0 ${STRIP_W} ${STRIP_H}" width="${STRIP_W * 3}" height="${STRIP_H * 3}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="${bodyPath}" fill="${color.bg}" stroke="${color.ink}" stroke-width="3.5"/>
    ${sprocketsSvg("left", color.ink)}
    ${sprocketsSvg("right", color.ink)}
    ${framesSvg}
    ${decorationSvg}
    ${doodleDecorationsSvg(color.ink)}
  </svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function compositeStrip(
  photos: string[],
  color: ColorVariant,
  stickers: Sticker[] = [],
  decorationText: string = "",
): Promise<string> {
  const svgString = buildStripSvg(photos, color, stickers, decorationText);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = STRIP_W * 3;
  canvas.height = STRIP_H * 3;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);

  return canvas.toDataURL("image/png");
}
