import cx from "classnames";
import s from "./Button.module.css";
import { useDebounce } from "../../hooks/useDebounce";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  debounceDelay?: number;
  className?: string;
  size?: "small" | "full";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Button = ({
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
  label,
  onClick,
  type = "button",
  disabled = false,
  debounceDelay = 300,
  className,
  size = "full",
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      type={type}
      disabled={disabled}
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
