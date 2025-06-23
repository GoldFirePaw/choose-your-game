import { useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import s from "./AddPlayerForm.module.css";
import { Button } from "../Buttons/Button";

export const AddPlayerForm = () => {
  const [name, setName] = useState("");
  const { addPlayer } = usePlayerContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    await addPlayer(trimmedName);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <h2 className={s.title}>Ajouter un joueur</h2>
      <input
        type="text"
        placeholder="Nom du joueur"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={s.input}
      />
      <Button type="submit" label={"Ajouter"} />
    </form>
  );
};
