"use client";

import { useState, useEffect } from "react";
import { ColorVariant } from "@/lib/themes";

interface ShareActionsProps {
  imageUrl: string;
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

async function uploadToImgBB(dataUrl: string): Promise<string> {
  // Convert data URL to blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  // Send blob to our API route
  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: blob,
  });
  const data = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(data.error || "Upload failed");
  }
  return data.url;
}

export function ShareActions({ imageUrl, color }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload automatically on mount
  useEffect(() => {
    let cancelled = false;
    setUploading(true);

    uploadToImgBB(imageUrl)
      .then((url) => {
        if (!cancelled) setHostedUrl(url);
      })
      .catch((e) => {
        if (!cancelled) setUploadError(e instanceof Error ? e.message : "Upload failed");
      })
      .finally(() => {
        if (!cancelled) setUploading(false);
      });

    return () => { cancelled = true; };
  }, [imageUrl]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `snapstrip-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [waitingForUpload, setWaitingForUpload] = useState(false);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setWaitingForUpload(false);
    setTimeout(() => setCopied(false), 2000);
  };

  // If user clicked while uploading, copy as soon as it's ready
  useEffect(() => {
    if (waitingForUpload && hostedUrl) {
      copyToClipboard(hostedUrl);
    }
  }, [waitingForUpload, hostedUrl]);

  const handleCopyLink = async () => {
    if (hostedUrl) {
      copyToClipboard(hostedUrl);
    } else if (uploading) {
      setWaitingForUpload(true);
    }
  };

  const handleRetry = () => {
    setUploadError(null);
    setHostedUrl(null);
    setUploading(true);
    uploadToImgBB(imageUrl)
      .then(setHostedUrl)
      .catch((e) => setUploadError(e instanceof Error ? e.message : "Upload failed"))
      .finally(() => setUploading(false));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <button onClick={handleDownload} className="btn-doodle">
          <DownloadIcon />
          Download
        </button>

        <button
          onClick={handleCopyLink}
          disabled={uploadError !== null}
          className="btn-doodle relative"
        >
          {waitingForUpload ? (
            <div
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: color.accent, borderTopColor: "transparent" }}
            />
          ) : (
            <LinkIcon />
          )}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-red-500">Failed to upload</p>
          <button onClick={handleRetry} className="btn-doodle text-sm">
            Retry
          </button>
        </div>
      )}

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
    </div>
  );
}
