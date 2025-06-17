import { useState } from "react";
import { useGamesContext } from "../contexts/gamesContext";

export const AddGameForm = () => {
  const [name, setName] = useState("");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);
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
    setMax(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un jeu</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
        required
      />
      <input
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        required
      />
      <input
        type="number"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
};
