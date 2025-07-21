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

  // Remplit le state local à partir du jeu actuel
  useEffect(() => {
    const updatedGame = games.find((g) => g._id === gameId);
    if (updatedGame) {
      setLocalPlayerIds([...(updatedGame.players ?? [])]);
      setName(updatedGame.name);
      setMinPlayers(updatedGame.minimumPlayers);
      setMaxPlayers(updatedGame.maximumPlayers);
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

    const uniquePlayerIds = Array.from(new Set(localPlayerIds));

    await updateGame(game._id, {
      name,
      minimumPlayers: minPlayers,
      maximumPlayers: maxPlayers,
      players: uniquePlayerIds,
    });

    setDisplayPlayers(false);
  };

  const { submit: debouncedSubmit, isLoading } = useSubmitWithDebounce(
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
    <div className={s.popperBackdrop} onClick={() => setDisplayPlayers(false)}>
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
                    />
                    {player.name}
                  </label>
                </div>
              ) : null
            )}
          </div>

          <div className={s.buttonRow}>
            <Button label={"Valider"} onClick={handleSubmit} type="submit" />
            <Button onClick={() => setDisplayPlayers(false)} label="Annuler" />
          </div>
        </form>
      </div>
    </div>
  );
};
