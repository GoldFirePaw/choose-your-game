import { useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import { useSubmitWithDebounce } from "../../hooks/useDebounce";
import s from "./AddGameForm.module.css";
import { Button } from "../Buttons/Button";

export const AddGameForm = () => {
  const [name, setName] = useState("");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(4);
  const { addGame } = useGamesContext();

  const handleAddGame = async () => {
    if (!name.trim()) return;

    await addGame({
      name,
      minimumPlayers: min,
      maximumPlayers: max,
      players: [],
    });

    setName("");
    setMin(1);
    setMax(4);
  };

  const { submit: debouncedSubmit, isLoading } = useSubmitWithDebounce(
    handleAddGame,
    500
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await debouncedSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <h2 id="add-game" className={s.title}>
        Ajouter un jeu
      </h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
        required
        className={s.input}
        disabled={isLoading()}
      />
      <input
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        required
        className={s.input}
        disabled={isLoading()}
      />
      <input
        type="number"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        required
        className={s.input}
        disabled={isLoading()}
      />
      <Button
        type="submit"
        label={isLoading() ? "Ajout..." : "Ajouter"}
        disabled={isLoading() || !name.trim()}
      />
    </form>
  );
};
