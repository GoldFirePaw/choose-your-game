import s from "./Button.module.css";
import cx from "classnames";
import { useDebounce } from "../../hooks/useDebounce";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  debounceDelay?: number; // Optional debounce delay in milliseconds
};

export const Button = ({
  label,
  onClick,
  type,
  disabled = false,
  debounceDelay = 300,
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      type={type}
      className={cx(s.button, s.primaryButton)}
      onClick={onClick ? debouncedClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export const SecondaryButton = ({
  label,
  onClick,
  type,
  disabled = false,
  debounceDelay = 300,
}: ButtonProps) => {
  const debouncedClick = useDebounce(onClick || (() => {}), debounceDelay);

  return (
    <button
      type={type}
      className={cx(s.button, s.secondaryButton)}
      onClick={onClick ? debouncedClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
