import { createContext, useContext } from "react";

export type Theme = "nebula" | "forest" | "sunset" | "amethyst" | "iceberg";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "nebula",
  setTheme: () => {},
});

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
