import { useEffect, useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
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

  const game = games.find((g) => g._id === gameId);
  if (!game) return null;

  // Remplit le state local à partir du jeu actuel
  useEffect(() => {
    const updatedGame = games.find((g) => g._id === gameId);
    if (updatedGame) {
      setLocalPlayerIds([...(updatedGame.players ?? [])]);
    }
  }, [gameId, games]); // <- on écoute TOUT le tableau

  const togglePlayer = (playerId: string) => {
    setLocalPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSubmit = async () => {
    // Nettoyage des doublons au cas où (par sécurité)
    const uniquePlayerIds = Array.from(new Set(localPlayerIds));

    console.log("🧾 Soumission des joueurs sélectionnés :", uniquePlayerIds);

    await updateGame(game._id, {
      name: game.name,
      minimumPlayers: game.minimumPlayers,
      maximumPlayers: game.maximumPlayers,
      players: uniquePlayerIds,
    });

    setDisplayPlayers(false);
  };

  return (
    <div className={s.popperBackdrop} onClick={() => setDisplayPlayers(false)}>
      <div className={s.popperContainer} onClick={(e) => e.stopPropagation()}>
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
          <Button label={"Valider"} onClick={handleSubmit} />
          <button onClick={() => setDisplayPlayers(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
};
