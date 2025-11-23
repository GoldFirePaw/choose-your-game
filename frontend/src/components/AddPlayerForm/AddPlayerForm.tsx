import { useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import { useSubmitWithDebounce } from "../../hooks/useDebounce";
import s from "./AddPlayerForm.module.css";
import { Button } from "../Buttons/Button";
import { Plus } from "../../assets/icons/Plus";
import { Close } from "../../assets/icons/Close";

export const AddPlayerForm = () => {
  const [name, setName] = useState("");
  const { addPlayer } = usePlayerContext();
  const [isOpen, setIsOpen] = useState(false);

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
      <Button
        id="add-player"
        className={s.title}
        onClick={() => {
          console.log("clicked");
          setIsOpen(!isOpen);
        }}
        label={
          <>
            {isOpen ? <Close /> : <Plus />}
            Ajouter un joueur
          </>
        }
      />
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
