import { useEffect, useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
import { useSubmitWithDebounce } from "../../hooks/useDebounce";
import s from "./gamePlayersCheckboxes.module.css";
import { Button } from "../Buttons/Button";

type Props = {
  gameId: string;
  setDisplayPlayers: (show: boolean) => void;
};

export const GamePlayersCheckboxes = ({ gameId, setDisplayPlayers }: Props) => {
  const { players } = usePlayerContext();
  const { games, updateGame } = useGamesContext();
  const [localPlayerIds, setLocalPlayerIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const game = games.find((g) => g._id === gameId);
  if (!game) return null;

  const [name, setName] = useState(game.name);
  const [minPlayers, setMinPlayers] = useState(game.minimumPlayers);
  const [maxPlayers, setMaxPlayers] = useState(game.maximumPlayers);
  const [isNavGame, setIsNavGame] = useState(game.isNavGame || false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Remplit le state local à partir du jeu actuel
  useEffect(() => {
    const updatedGame = games.find((g) => g._id === gameId);
    if (updatedGame) {
      setLocalPlayerIds([...(updatedGame.players ?? [])]);
      setName(updatedGame.name);
      setMinPlayers(updatedGame.minimumPlayers);
      setMaxPlayers(updatedGame.maximumPlayers);
      setIsNavGame(updatedGame.isNavGame || false);
    }
  }, [gameId, games]);

  const togglePlayer = (playerId: string) => {
    setLocalPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleUpdateGame = async () => {
    if (minPlayers > maxPlayers) {
      setError("Le nombre minimum de joueurs ne peut pas dépasser le maximum.");
      return;
    }

    setError(null); // Nettoie l'erreur précédente si OK

    // If it's a nav game, assign to all players
    const finalPlayerIds = isNavGame
      ? players.map((p) => p._id)
      : Array.from(new Set(localPlayerIds));

    await updateGame(game._id, {
      name,
      minimumPlayers: minPlayers,
      maximumPlayers: maxPlayers,
      players: finalPlayerIds,
      isNavGame,
    });

    setDisplayPlayers(false);
  };

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
    if (confirmed) {
      // Automatically select all players when it becomes a nav game
      setLocalPlayerIds(players.map((p) => p._id));
    }
  };

  const { submit: debouncedSubmit } = useSubmitWithDebounce(
    handleUpdateGame,
    500
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSubmit();
  };

  const handleSubmit = async () => {
    await debouncedSubmit();
  };

  return (
    <>
      <div
        className={s.popperBackdrop}
        onClick={() => setDisplayPlayers(false)}
      >
        <div className={s.popperContainer} onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleFormSubmit}>
            <h4>Modifier infos jeu</h4>
            <p>
              <strong>Nom du jeu :</strong>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={s.input}
              />
            </p>
            <p>
              <strong>Nombre de joueurs :</strong>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <input
                type="number"
                value={minPlayers}
                onChange={(e) => setMinPlayers(Number(e.target.value))}
                min={1}
                className={s.input}
              />{" "}
              à{" "}
              <input
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                min={minPlayers}
                className={s.input}
              />
            </p>

            <div className={s.navGameContainer}>
              <label className={s.navGameLabel}>
                <input
                  type="checkbox"
                  checked={isNavGame}
                  onChange={(e) => handleNavGameChange(e.target.checked)}
                  className={s.checkbox}
                />
                <span className={s.checkboxText}>
                  🧭 Jeu de navigateur (possédé par tous les joueurs)
                </span>
              </label>
            </div>

            <h4>Joueurs possédant le jeu :</h4>
            <div>
              {players.map((player) =>
                typeof player._id === "string" ? (
                  <div key={player._id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={localPlayerIds.includes(player._id)}
                        onChange={() => togglePlayer(player._id)}
                        disabled={isNavGame} // Disable when it's a nav game
                      />
                      {player.name}
                    </label>
                  </div>
                ) : null
              )}
            </div>

            <div className={s.buttonRow}>
              <Button label={"Valider"} onClick={handleSubmit} type="submit" />
              <Button
                onClick={() => setDisplayPlayers(false)}
                label="Annuler"
              />
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className={s.confirmDialog}>
          <div className={s.confirmContent}>
            <h3>Confirmation</h3>
            <p>
              Êtes-vous sûr que c'est un jeu de navigateur ? Il sera
              automatiquement ajouté à tous les joueurs.
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
