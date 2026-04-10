export interface ColorVariant {
  id: string;
  name: string;
  bg: string;
  frames: [string, string, string, string];
  accent: string;
  ink: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ColorVariant[];
}

export const themes: Theme[] = [
  {
    id: "classic",
    name: "Classic Strip",
    colors: [
      {
        id: "pink",
        name: "Pink",
        bg: "#FFF0F3",
        frames: ["#FFE0E8", "#FFD1DC", "#FFC0D0", "#FFB0C4"],
        accent: "#E8456B",
        ink: "#2A2A2A",
      },
      {
        id: "yellow",
        name: "Yellow",
        bg: "#FFFDE8",
        frames: ["#FFF3B0", "#FFE98A", "#FFEAA0", "#FFF0C0"],
        accent: "#F5C842",
        ink: "#2A2A2A",
      },
      {
        id: "blue",
        name: "Blue",
        bg: "#EAF4FF",
        frames: ["#D6EDFF", "#C0E0FF", "#B0D8FF", "#C8E4FF"],
        accent: "#4A9FE8",
        ink: "#2A2A2A",
      },
      {
        id: "green",
        name: "Green",
        bg: "#EDFCF5",
        frames: ["#D0F5E8", "#B8EDDA", "#A8E8D0", "#C0F0E0"],
        accent: "#3DBEA0",
        ink: "#2A2A2A",
      },
      {
        id: "purple",
        name: "Purple",
        bg: "#F3EEFF",
        frames: ["#EDE0FF", "#E0D0FF", "#D4C0FF", "#E4D8FF"],
        accent: "#8B6CC1",
        ink: "#2A2A2A",
      },
    ],
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) ?? themes[0];
}

export function getColorById(themeId: string, colorId: string): ColorVariant {
  const theme = getThemeById(themeId);
  return theme.colors.find((c) => c.id === colorId) ?? theme.colors[0];
}
