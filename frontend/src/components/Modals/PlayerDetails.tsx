import { useEffect, useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import { useGamesContext } from "../../contexts/gamesContext";
import { SecondaryButton, Button } from "../Buttons/Button";
import { usePasswordProtectedDelete } from "../../hooks/usePasswordProtectedDelete";
import { PasswordDialog } from "../PasswordDialog/PasswordDialog";
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

  // Password protection for delete operations
  const {
    showPasswordDialog,
    loading: deleting,
    error: deleteError,
    openPasswordDialog,
    closePasswordDialog,
    handlePasswordConfirm,
  } = usePasswordProtectedDelete();

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

  const handleDeletePlayer = async (password: string) => {
    const result = await deletePlayer(playerId, password);
    if (result.success) {
      onClose();
    }
    return result;
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
          onClick={openPasswordDialog}
          label={deleting ? "Suppression..." : "Supprimer le joueur"}
          disabled={deleting}
        />
        <Button label="Fermer" onClick={onClose} />
      </div>

      {deleteError && <div className={s.error}>{deleteError}</div>}

      {showPasswordDialog && (
        <PasswordDialog
          isOpen={showPasswordDialog}
          onCancel={closePasswordDialog}
          onConfirm={(password) =>
            handlePasswordConfirm(password, handleDeletePlayer)
          }
          loading={deleting}
          title="Supprimer le joueur"
          message={`Êtes-vous sûr de vouloir supprimer le joueur "${
            players.find((p) => p._id === playerId)?.name
          }" ?`}
        />
      )}
    </div>
  );
};
