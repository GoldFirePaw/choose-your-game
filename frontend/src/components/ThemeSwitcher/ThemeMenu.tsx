import { useState } from "react";
import { Button } from "../Buttons/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import s from "./ThemeSwitcher.module.css";

// TODO: improve the display of the theme switcher menu (position, animation, etc.)
// On hover open then close when mouse leave
// On click toggle open/close

export const ThemeMenu = () => {
  const [isThemeSwitcherDisplayed, setDisplayThemeSwitcher] = useState(false);

  const handleMouseEnter = () => {
    setDisplayThemeSwitcher(true);
  };
  const handleMouseLeave = () => {
    setDisplayThemeSwitcher(false);
  };

  return (
    <div className={s.themeMenu} onMouseLeave={handleMouseLeave}>
      <Button
        size="small"
        className={s.themesButton}
        label="Thèmes"
        onMouseEnter={handleMouseEnter}
      />
      {isThemeSwitcherDisplayed && <ThemeSwitcher />}
    </div>
  );
};
