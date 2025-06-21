import s from "./Button.module.css";

type ButtonProps = {
  label: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
};

export const Button = ({ label, onClick, type }: ButtonProps) => {
  return (
    <button type={type} className={s.button} onClick={onClick}>
      {label}
    </button>
  );
};
