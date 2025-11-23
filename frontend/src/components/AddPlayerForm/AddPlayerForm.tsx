import { useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import { useSubmitWithDebounce } from "../../hooks/useDebounce";
import s from "./AddPlayerForm.module.css";
import { Button } from "../Buttons/Button";

interface AddPlayerFormProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [name, setName] = useState("");
  const { addPlayer } = usePlayerContext();

  const handleAddPlayer = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    await addPlayer(trimmedName);
    setName("");
  };

  const { submit: debouncedSubmit, isLoading } = useSubmitWithDebounce(
    handleAddPlayer,
    500
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await debouncedSubmit();
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      {isOpen && (
        <>
          <input
            type="text"
            placeholder="Nom du joueur"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={s.input}
            disabled={isLoading()}
          />
          <Button
            type="submit"
            label={isLoading() ? "Ajout..." : "Ajouter"}
            disabled={isLoading() || !name.trim()}
          />
        </>
      )}
    </form>
  );
};
