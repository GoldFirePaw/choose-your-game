import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./themeStore";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as
      | Theme
      | null;
    return saved || "nebula";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// `useTheme` moved to `src/contexts/themeStore.ts` to keep this file exporting only components
