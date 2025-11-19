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
}

export const Button = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  debounceDelay = 300,
  className,
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick ? debouncedClick : undefined}
      className={cx(s.button, s.primary, className)}
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
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick ? debouncedClick : undefined}
      className={cx(s.button, s.secondary, className)}
    >
      {label}
    </button>
  );
};
