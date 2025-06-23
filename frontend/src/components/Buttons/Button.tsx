import s from "./Button.module.css";
import cx from "classnames";

type ButtonProps = {
  label: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export const Button = ({ label, onClick, type }: ButtonProps) => {
  return (
    <button
      type={type}
      className={cx(s.button, s.primaryButton)}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const SecondaryButton = ({ label, onClick, type }: ButtonProps) => {
  return (
    <button
      type={type}
      className={cx(s.button, s.secondaryButton)}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
