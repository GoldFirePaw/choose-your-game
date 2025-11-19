import React from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import type { Player } from "../../types";
import s from "./ActivePlayers.module.css";

interface ActivePlayersProps {
  selected: Player[];
  onChange: (players: Player[]) => void;
  setModalContent: (content: string) => void;
}

export const ActivePlayers: React.FC<ActivePlayersProps> = ({
  selected,
  onChange,
  setModalContent,
}) => {
  const { players, handleSelectPlayer } = usePlayerContext();

  const toggle = (player: Player) => {
    const isSelected = selected.some((p) => p._id === player._id);

    const newSelection = isSelected
      ? selected.filter((p) => p._id !== player._id)
      : [...selected, player];

    onChange(newSelection);
  };

  const openDetails = (playerId: string) => {
    handleSelectPlayer(playerId);
    setModalContent("playerDetails");
  };

  return (
    <div>
      <h3 id="active-players">Joueurs présents</h3>

      <p className={s.instructions}>
        Cliquez sur un joueur pour voir ses détails <br />
        Cochez pour l’ajouter à la partie.
      </p>

      <div className={s.playersContainer}>
        {players.map((player) => {
          const isChecked = selected.some((p) => p._id === player._id);

          return (
            <div key={player._id} className={s.playerContainer}>
              <label
                className={s.checkboxLabel}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(player)}
                />
              </label>

              <span
                className={s.playerName}
                onClick={() => openDetails(player._id)}
              >
                {player.name}
              </span>

              <button
                type="button"
                className={s.editBtn}
                onClick={() => openDetails(player._id)}
              >
                ✏️
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
