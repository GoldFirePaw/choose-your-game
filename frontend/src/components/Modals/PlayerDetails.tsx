import { useEffect, useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import { useGamesContext } from "../../contexts/gamesContext";
import { SecondaryButton, Button } from "../Buttons/Button";
import s from "./PlayerDetails.module.css";

type PlayerDetailsProps = {
  playerId: string;
  onClose: () => void;
};

export const PlayerDetails = ({ playerId, onClose }: PlayerDetailsProps) => {
  const { deletePlayer, players } = usePlayerContext();
  const { games, updateGame } = useGamesContext();

  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const preSelected = games
      .filter((game) => game.players?.includes(playerId))
      .map((game) => game._id);
    setSelectedGames(preSelected);
  }, [games, playerId]);

  const toggleGame = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleAddToGames = async () => {
    setLoading(true);
    for (const game of games) {
      const alreadyIn = game.players?.includes(playerId) ?? false;
      const shouldBeIn = selectedGames.includes(game._id);

      if (shouldBeIn && !alreadyIn) {
        await updateGame(game._id, {
          ...game,
          players: [...(game.players ?? []), playerId],
        });
      }

      if (!shouldBeIn && alreadyIn) {
        await updateGame(game._id, {
          ...game,
          players: (game.players ?? []).filter((id: string) => id !== playerId),
        });
      }
    }
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className={s.playerDetails}>
      <h2 className={s.title}>Détails du joueur</h2>
      <div className={s.playerName}>
        {players.find((p) => p._id === playerId)?.name || "Joueur inconnu"}
      </div>
      <div>
        <h4 className={s.subtitle}>Associer ce joueur à des jeux :</h4>
        <div className={s.gamesList}>
          {[...games]
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            .map((game) => (
              <label key={game._id} className={s.gameLabel}>
                <input
                  type="checkbox"
                  checked={selectedGames.includes(game._id)}
                  onChange={() => toggleGame(game._id)}
                  className={s.checkbox}
                />
                {game.name}
              </label>
            ))}
        </div>
      </div>
      <div className={s.actions}>
        <Button
          label={
            loading
              ? "Ajout..."
              : success
              ? "✅ Jeux mis à jour !"
              : "Mettre à jour les jeux"
          }
          onClick={handleAddToGames}
          disabled={loading}
        />
        <SecondaryButton
          onClick={() => {
            deletePlayer(playerId);
            onClose();
          }}
          label={"Supprimer le joueur"}
        />
      </div>
    </div>
  );
};
