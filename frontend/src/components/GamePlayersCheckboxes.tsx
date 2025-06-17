import { useState } from "react";
import {
  addPlayerToGame,
  removePlayerFromGame,
} from "../api/games/updatePlayers";
import { useGamesContext } from "../contexts/gamesContext";
import { usePlayerContext } from "../contexts/playersContext";
import type { Game } from "../types";
import type { Player } from "../types";
import s from "./gamePlayersCheckboxes.module.css";

type Props = {
  game: Game;
  onUpdate?: () => void;
  setDisplayPlayers: (show: boolean) => void;
};

export const GamePlayersCheckboxes = ({ game, setDisplayPlayers }: Props) => {
  const { players } = usePlayerContext();
  const { refetchGames } = useGamesContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const isPlayerInGame = (player: Player) =>
    game.players?.some((p) => p._id === player._id);

  const handleToggle = async (player: Player) => {
    if (isUpdating) return; // empêcher les doubles clics
    setIsUpdating(true);

    const alreadyIn = isPlayerInGame(player);

    const success = alreadyIn
      ? await removePlayerFromGame(game._id, player._id)
      : await addPlayerToGame(game._id, player._id);

    if (success) {
      await refetchGames();
    }

    setIsUpdating(false);
  };

  return (
    <div className={s.popperBackdrop} onClick={() => setDisplayPlayers(false)}>
      <div className={s.popperContainer} onClick={(e) => e.stopPropagation()}>
        <h4>Joueurs possédant le jeu :</h4>
        <div>
          {players.map((player) => (
            <div key={player._id}>
              <label>
                <input
                  type="checkbox"
                  checked={isPlayerInGame(player)}
                  onChange={() => handleToggle(player)}
                />
                {player.name}
              </label>
            </div>
          ))}
        </div>
        <button
          className={s.closeButton}
          onClick={() => setDisplayPlayers(false)}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
