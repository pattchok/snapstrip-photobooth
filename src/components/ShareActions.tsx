"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { ColorVariant } from "@/lib/themes";

interface ShareActionsProps {
  imageUrl: string;
  shareUrl: string;
  color: ColorVariant;
}

function DownloadIcon() {
  return (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function QRIcon() {
  return (
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" rx="0.5" />
      <line x1="21" y1="14" x2="21" y2="17" />
      <line x1="14" y1="21" x2="17" y2="21" />
      <line x1="21" y1="21" x2="21" y2="21" />
    </svg>
  );
}

function LinkIcon() {
  return (
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function ShareActions({ imageUrl, shareUrl, color }: ShareActionsProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showQR && !qrDataUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: color.accent,
          light: color.bg,
        },
        errorCorrectionLevel: "M",
      }).then(setQrDataUrl);
    }
  }, [showQR, shareUrl, color, qrDataUrl]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `snapstrip-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `snapstrip-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <button onClick={handleDownload} className="btn-doodle">
          <DownloadIcon />
          Download
        </button>

        <button onClick={() => setShowQR(!showQR)} className="btn-doodle">
          <QRIcon />
          QR Code
        </button>

        <button onClick={handleCopyLink} className="btn-doodle relative">
          <LinkIcon />
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {copied && (
        <div
          className="animate-toast card-doodle px-4 py-2 text-sm font-bold"
          style={{
            backgroundColor: color.bg,
            borderColor: color.accent,
          }}
        >
          Link copied to clipboard!
        </div>
      )}

      {showQR && (
        <div
          ref={qrRef}
          className="animate-fade-in card-doodle p-6 flex flex-col items-center gap-4"
          style={{
            backgroundColor: color.bg,
            borderColor: color.accent,
          }}
        >
          {qrDataUrl ? (
            <>
              <img
                src={qrDataUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <p className="text-xs text-center opacity-60 max-w-[200px]">
                Scan to view your photo strip
              </p>
              <button
                onClick={handleDownloadQR}
                className="btn-doodle text-sm"
              >
                <DownloadIcon />
                Download QR
              </button>
            </>
          ) : (
            <div
              className="w-8 h-8 border-3 border-t-transparent rounded-full spinner-doodle"
              style={{
                borderColor: color.accent,
                borderTopColor: "transparent",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
