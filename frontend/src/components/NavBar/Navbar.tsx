import { useState } from "react";
import cx from "classnames";
import { Bars } from "../../assets/icons/Bars";
import { HelpModal } from "../Modals/HelpModal/HelpModal";
import { ThemeMenu } from "../ThemeSwitcher/ThemeMenu";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { Button } from "../Buttons/Button";
import s from "./Navbar.module.css";

export const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const [displayThemeSwitcher, setDisplayThemeSwitcher] = useState(false);

  return (
    <nav
      className={cx(s.navbarContainer, isOpen ? s.openNavbar : s.closedNavbar)}
      onMouseLeave={() => {
        setOpen(false);
        setDisplayThemeSwitcher(false);
      }}
    >
      <Button
        onClick={() => {
          setOpen(!isOpen);
          setDisplayThemeSwitcher(false);
        }}
        label={<Bars />}
      />
      {isOpen && (
        <div className={s.navbar}>
          <ThemeMenu setDisplayThemeSwitcher={setDisplayThemeSwitcher} />
          {displayThemeSwitcher && <ThemeSwitcher />}
          <HelpModal />
        </div>
      )}
    </nav>
  );
};
