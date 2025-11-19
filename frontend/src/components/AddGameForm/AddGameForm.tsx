import React, { useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
import { useSubmitWithDebounce } from "../../hooks/useDebounce";
import s from "./AddGameForm.module.css";
import { Button } from "../Buttons/Button";

export const AddGameForm: React.FC = () => {
  const [name, setName] = useState("");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(4);
  const [isNavGame, setIsNavGame] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { addGame } = useGamesContext();
  const { players } = usePlayerContext();

  const handleAddGame = async () => {
    if (!name.trim()) return;

    const gameData = {
      name,
      minimumPlayers: min,
      maximumPlayers: max,
      players: isNavGame ? players : [],
      isNavGame,
    };

    await addGame(gameData);

    setName("");
    setMin(1);
    setMax(4);
    setIsNavGame(false);
  };

  const { submit: debouncedSubmit, isLoading } = useSubmitWithDebounce(
    handleAddGame,
    500
  );

  const handleNavGameChange = (checked: boolean) => {
    if (checked) {
      setShowConfirm(true);
    } else {
      setIsNavGame(false);
    }
  };

  const confirmNavGame = (confirmed: boolean) => {
    setShowConfirm(false);
    setIsNavGame(confirmed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await debouncedSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={s.form}>
        <h2 className={s.title}>Ajouter un jeu</h2>

        <input
          className={s.input}
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading()}
          required
        />

        <input
          className={s.input}
          type="number"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          disabled={isLoading()}
          required
        />

        <input
          className={s.input}
          type="number"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          disabled={isLoading()}
          required
        />

        <div className={s.navGameContainer}>
          <label className={s.navGameLabel}>
            <input
              type="checkbox"
              className={s.checkbox}
              checked={isNavGame}
              onChange={(e) => handleNavGameChange(e.target.checked)}
              disabled={isLoading()}
            />
            <span className={s.checkboxText}>
              🧭 Jeu de navigateur (possédé par tous les joueurs)
            </span>
          </label>
        </div>

        <Button
          type="submit"
          label={isLoading() ? "Ajout..." : "Ajouter"}
          disabled={isLoading() || !name.trim()}
        />
      </form>

      {showConfirm && (
        <div className={s.confirmDialog}>
          <div className={s.confirmContent}>
            <h3>Confirmation</h3>
            <p>
              Êtes-vous sûr que c'est un jeu de navigateur ? Il sera ajouté à
              tous les joueurs.
            </p>

            <div className={s.confirmButtons}>
              <Button
                label="Oui, c'est un jeu de navigateur"
                onClick={() => confirmNavGame(true)}
              />
              <Button
                label="Non, annuler"
                onClick={() => confirmNavGame(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
