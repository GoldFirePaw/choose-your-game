import { useState } from "react";
import { Button } from "../Buttons/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import s from "./ThemeSwitcher.module.css";

export const ThemeMenu = () => {
  const [isThemeSwitcherDisplayed, setDisplayThemeSwitcher] = useState(false);
  const [displayThemeSwitcherWithClick, setDisplayThemeSwitcherWithClick] =
    useState(false);

  const handleMouseEnter = () => {
    if (displayThemeSwitcherWithClick) {
      setDisplayThemeSwitcher(true);
      return;
    }
    setDisplayThemeSwitcher(true);
  };
  const handleMouseLeave = () => {
    if (displayThemeSwitcherWithClick) {
      setDisplayThemeSwitcher(true);
      return;
    }
    setDisplayThemeSwitcher(false);
  };

  return (
    <div className={s.themeMenu} onMouseLeave={handleMouseLeave}>
      <Button
        size="small"
        className={s.themesButton}
        label="Thèmes"
        onClick={() => {
          setDisplayThemeSwitcher(!isThemeSwitcherDisplayed);
          setDisplayThemeSwitcherWithClick(!displayThemeSwitcherWithClick);
        }}
        onMouseEnter={handleMouseEnter}
      />
      {displayThemeSwitcherWithClick ||
        (isThemeSwitcherDisplayed && <ThemeSwitcher />)}
    </div>
  );
};
