import React, { useEffect, useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
import { useSubmitWithDebounce } from "../../hooks/useDebounce";
import s from "./gamePlayersCheckboxes.module.css";
import { Button } from "../Buttons/Button";

interface Props {
  gameId: string;
  setDisplayPlayers: (show: boolean) => void;
}

export const GamePlayersCheckboxes: React.FC<Props> = ({
  gameId,
  setDisplayPlayers,
}) => {
  const { players } = usePlayerContext();
  const { games, updateGame } = useGamesContext();

  const [localPlayerIds, setLocalPlayerIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const game = games.find((g) => g._id === gameId);
  if (!game) return null;

  const [name, setName] = useState(game.name);
  const [minPlayers, setMinPlayers] = useState(game.minimumPlayers);
  const [maxPlayers, setMaxPlayers] = useState(game.maximumPlayers);
  const [isNavGame, setIsNavGame] = useState(game.isNavGame ?? false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* Sync local state with updated game */
  useEffect(() => {
    const updated = games.find((g) => g._id === gameId);
    if (updated) {
      setLocalPlayerIds([...(updated.players ?? [])]);
      setName(updated.name);
      setMinPlayers(updated.minimumPlayers);
      setMaxPlayers(updated.maximumPlayers);
      setIsNavGame(updated.isNavGame ?? false);
    }
  }, [gameId, games]);

  const togglePlayer = (playerId: string) => {
    setLocalPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  /* Update game */
  const handleUpdateGame = async () => {
    if (minPlayers > maxPlayers) {
      setError("Le nombre minimum ne peut pas dépasser le maximum.");
      return;
    }

    setError(null);

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
      setLocalPlayerIds(players.map((p) => p._id));
    }
  };

  const { submit: debouncedSubmit } = useSubmitWithDebounce(
    handleUpdateGame,
    500
  );

  return (
    <>
      <div className={s.popperBackdrop} onClick={() => setDisplayPlayers(false)}>
        <div className={s.popperContainer} onClick={(e) => e.stopPropagation()}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              debouncedSubmit();
            }}
          >
            <h4>Modifier infos jeu</h4>

            <p>
              <strong>Nom du jeu :</strong>
              <input
                className={s.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </p>

            <p>
              <strong>Nombre de joueurs :</strong>
              {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

              <input
                type="number"
                className={s.input}
                value={minPlayers}
                onChange={(e) => setMinPlayers(Number(e.target.value))}
                min={1}
              />

              {" à "}

              <input
                type="number"
                className={s.input}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                min={minPlayers}
              />
            </p>

            <div className={s.navGameContainer}>
              <label className={s.navGameLabel}>
                <input
                  type="checkbox"
                  className={s.checkbox}
                  checked={isNavGame}
                  onChange={(e) => handleNavGameChange(e.target.checked)}
                />
                <span className={s.checkboxText}>
                  🧭 Jeu de navigateur (tous les joueurs le possèdent)
                </span>
              </label>
            </div>

            <h4>Joueurs possédant le jeu :</h4>

            <div>
              {players.map((player) => (
                <div className={s.playerItem} key={player._id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={localPlayerIds.includes(player._id)}
                      onChange={() => togglePlayer(player._id)}
                      disabled={isNavGame}
                    />
                    {player.name}
                  </label>
                </div>
              ))}
            </div>

            <div className={s.buttonRow}>
              <Button label="Valider" onClick={debouncedSubmit} />
              <Button label="Annuler" onClick={() => setDisplayPlayers(false)} />
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className={s.confirmDialog}>
          <div className={s.confirmContent}>
            <h3>Confirmation</h3>
            <p>
              Voulez-vous vraiment en faire un jeu de navigateur ?
              Il sera automatiquement associé à tous les joueurs.
            </p>

            <div className={s.confirmButtons}>
              <Button label="Oui" onClick={() => confirmNavGame(true)} />
              <Button label="Non" onClick={() => confirmNavGame(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
