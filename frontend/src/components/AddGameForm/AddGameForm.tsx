import { useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import s from "./AddGameForm.module.css";
import { Button } from "../Buttons/Button";

export const AddGameForm = () => {
  const [name, setName] = useState("");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(4);
  const { addGame } = useGamesContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <h2 className={s.title}>Ajouter un jeu</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
        required
        className={s.input}
      />
      <input
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        required
        className={s.input}
      />
      <input
        type="number"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        required
        className={s.input}
      />
      <Button onClick={() => handleSubmit} type="submit" label={"Ajouter"} />
      Ajouter
    </form>
  );
};
