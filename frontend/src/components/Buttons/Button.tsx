import cx from "classnames";
import s from "./Button.module.css";
import { useDebounce } from "../../hooks/useDebounce";
import type { JSX } from "react";

interface ButtonProps {
  label: string | JSX.Element;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  debounceDelay?: number;
  className?: string;
  size?: "small" | "full";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  id?: string;
}

export const Button = ({
  id,
  label,
  onClick,
  type = "button",
  disabled = false,
  debounceDelay = 300,
  className,
  onMouseEnter,
  onMouseLeave,
  size = "full",
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick ? debouncedClick : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(
        s.button,
        s.primary,
        size === "small" ? s.small : s.full,
        className
      )}
    >
      {label}
    </button>
  );
};

export const SecondaryButton = ({
  id,
  label,
  onClick,
  type = "button",
  disabled = false,
  debounceDelay = 300,
  className,
  onMouseEnter,
  size = "full",
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onClick={onClick ? debouncedClick : undefined}
      className={cx(
        s.button,
        s.secondary,
        size === "small" ? s.small : s.full,
        className
      )}
    >
      {label}
    </button>
  );
};
