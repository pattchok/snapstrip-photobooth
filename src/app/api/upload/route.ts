import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "IMGBB_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    // Receive the image as a raw blob
    const blob = await req.blob();
    if (!blob.size) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert blob to base64 for ImgBB
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const form = new FormData();
    form.append("key", apiKey);
    form.append("image", base64Data);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.error?.message || "Upload failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: data.data.url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
