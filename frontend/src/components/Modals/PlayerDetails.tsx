import { useEffect, useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import { useGamesContext } from "../../contexts/gamesContext";
import { SecondaryButton, Button } from "../Buttons/Button";

type PlayerDetailsProps = {
  playerId: string;
  onClose: () => void;
};

export const PlayerDetails = ({ playerId, onClose }: PlayerDetailsProps) => {
  const { deletePlayer } = usePlayerContext();
  const { games, updateGame } = useGamesContext();

  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pré-cocher les jeux dans lesquels le joueur est déjà présent
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
    <div className="playerDetails">
      <h2>Détails du joueur</h2>

      <div>
        <h4>Associer ce joueur à des jeux :</h4>
        {games.map((game) => (
          <label key={game._id}>
            <input
              type="checkbox"
              checked={selectedGames.includes(game._id)}
              onChange={() => toggleGame(game._id)}
            />
            {game.name}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
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
      </div>

      <hr />

      <SecondaryButton
        onClick={() => {
          deletePlayer(playerId);
          onClose();
        }}
        label={"Supprimer le joueur"}
      />
    </div>
  );
};
