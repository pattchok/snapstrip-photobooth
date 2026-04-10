"use client";

interface CountdownOverlayProps {
  number: number;
  accentColor: string;
}

export function CountdownOverlay({ number, accentColor }: CountdownOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div
        className="countdown-number font-heading text-[120px] font-bold leading-none"
        style={{
          color: accentColor,
          textShadow: `4px 4px 0px #2A2A2A`,
          WebkitTextStroke: "3px #2A2A2A",
          paintOrder: "stroke fill",
        }}
        key={number}
      >
        {number}
      </div>
    </div>
  );
}
