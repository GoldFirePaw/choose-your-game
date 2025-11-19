import React from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import { GamePlayersCheckboxes } from "../GamePlayersCheckboxes/GamePlayersCheckboxes";
import s from "./GameCard.module.css";
import { Button, SecondaryButton } from "../Buttons/Button";
import { PasswordDialog } from "../PasswordDialog/PasswordDialog";
import { usePasswordProtectedDelete } from "../../hooks/usePasswordProtectedDelete";

interface GameCardProps {
  gameId: string;
  isActive: boolean;
  setActiveGameId: (id: string | null) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  gameId,
  isActive,
  setActiveGameId,
}) => {
  const { games, deleteGame } = useGamesContext();
  const {
    showPasswordDialog,
    loading,
    openPasswordDialog,
    closePasswordDialog,
    handlePasswordConfirm,
  } = usePasswordProtectedDelete();

  const game = games.find((g) => g._id === gameId);

  if (!game) {
    return <p>Jeu non trouvé.</p>;
  }

  const handleDeleteClick = () => {
    openPasswordDialog();
  };

  const handleDeleteConfirm = (password: string) => {
    return deleteGame(game._id, password);
  };

  return (
    <>
      <div className={s.gameCard}>
        <div className={s.titleContainer}>
          <span className={s.title}>{game.name}</span>
          {game.isNavGame && <span className={s.navBadge}>🧭</span>}
        </div>

        <p className={s.playersInfo}>
          Joueurs : {game.minimumPlayers}–{game.maximumPlayers}
        </p>

        <div className={s.buttonsRow}>
          <Button
            label="Éditer"
            onClick={() => setActiveGameId(isActive ? null : game._id)}
          />
          <SecondaryButton label="✖️" onClick={handleDeleteClick} />
        </div>
      </div>

      {isActive && (
        <GamePlayersCheckboxes
          key={`${game._id}-modal`}
          gameId={game._id}
          setDisplayPlayers={() => setActiveGameId(null)}
        />
      )}

      <PasswordDialog
        isOpen={showPasswordDialog}
        title="Supprimer le jeu"
        message={`Êtes-vous sûr de vouloir supprimer le jeu "${game.name}" ? Cette action est irréversible.`}
        onConfirm={(password) =>
          handlePasswordConfirm(password, handleDeleteConfirm)
        }
        onCancel={closePasswordDialog}
        loading={loading}
      />
    </>
  );
};
