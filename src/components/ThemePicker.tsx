"use client";

import { themes, Theme, ColorVariant } from "@/lib/themes";

interface ThemePickerProps {
  selectedThemeId: string;
  selectedColorId: string;
  onSelectTheme: (id: string) => void;
  onSelectColor: (id: string) => void;
}

function ThemeCard({
  theme,
  selected,
  selectedColorId,
  onSelectTheme,
  onSelectColor,
}: {
  theme: Theme;
  selected: boolean;
  selectedColorId: string;
  onSelectTheme: () => void;
  onSelectColor: (id: string) => void;
}) {
  const activeColor = theme.colors.find((c) => c.id === selectedColorId) ?? theme.colors[0];

  return (
    <div
      className={`card-doodle flex flex-col gap-3 w-full transition-all cursor-pointer ${
        selected ? "card-doodle-selected border-[3px]" : "border-[2px] opacity-75 hover:opacity-100"
      }`}
      style={{
        borderColor: selected ? activeColor.accent : "#2A2A2A",
        background: selected ? activeColor.bg : "#fff",
      }}
      onClick={onSelectTheme}
    >
      <span className="font-heading text-base font-bold">
        {theme.name}
      </span>

      {/* Color dots */}
      <div className="flex gap-2">
        {theme.colors.map((color) => {
          const isActive = selected && color.id === selectedColorId;
          return (
            <button
              key={color.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTheme();
                onSelectColor(color.id);
              }}
              className="w-7 h-7 rounded-full border-[2px] transition-all"
              style={{
                backgroundColor: color.accent,
                borderColor: isActive ? "#2A2A2A" : color.accent,
                transform: isActive ? "scale(1.2)" : "scale(1)",
                boxShadow: isActive ? "0 0 0 2px #fff, 0 0 0 4px #2A2A2A" : "none",
              }}
              title={color.name}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ThemePicker({
  selectedThemeId,
  selectedColorId,
  onSelectTheme,
  onSelectColor,
}: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={theme.id === selectedThemeId}
            selectedColorId={selectedColorId}
            onSelectTheme={() => onSelectTheme(theme.id)}
            onSelectColor={onSelectColor}
          />
        ))}
      </div>
    </div>
  );
}
