import React from "react";
import { useTheme, type Theme } from "../../contexts/themeStore";
import s from "./ThemeSwitcher.module.css";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string }[] = [
    { id: "nebula", label: "🌌 Nebula" },
    { id: "forest", label: "🌲 Forest" },
    { id: "sunset", label: "🌅 Sunset" },
    { id: "amethyst", label: "💜 Amethyst" },
    { id: "iceberg", label: "❄️ Iceberg" },
  ];

  return (
    <div className={s.switcher}>
      {themes.map((t) => (
        <button
          key={t.id}
          className={`${s.button} ${theme === t.id ? s.active : ""}`}
          onClick={() => setTheme(t.id)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};
