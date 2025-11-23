import { SecondaryButton } from "../Buttons/Button";
import s from "./ThemeSwitcher.module.css";

// TODO: improve the display of the theme switcher menu (position, animation, etc.)
// On hover open then close when mouse leave
// On click toggle open/close

type ThemeMenuProps = {
  setDisplayThemeSwitcher: (display: boolean) => void;
};

export const ThemeMenu = ({ setDisplayThemeSwitcher }: ThemeMenuProps) => {
  const handleMouseEnter = () => {
    setDisplayThemeSwitcher(true);
  };

  return (
    <div className={s.themeMenu}>
      <SecondaryButton label="Thèmes" onMouseEnter={handleMouseEnter} />
    </div>
  );
};
