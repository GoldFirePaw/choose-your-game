import { useEffect, useState } from "react";
import {
  addPlayerToGame,
  removePlayerFromGame,
} from "../../api/games/updatePlayers";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
import type { Player } from "../../types";
import s from "./gamePlayersCheckboxes.module.css";

type Props = {
  gameId: string;
  setDisplayPlayers: (show: boolean) => void;
};

export const GamePlayersCheckboxes = ({ gameId, setDisplayPlayers }: Props) => {
  const { players } = usePlayerContext();
  const { games, refetchGames } = useGamesContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const game = games.find((g) => g._id === gameId);

  if (!game) return null;

  console.log(
    game._id,
    "🔍 Vérification du jeu dans le contexte",
    game.players,
    "joueurs :"
  );

  const isPlayerInGame = (player: Player) =>
    Array.isArray(game.players) && game.players.includes(player._id);

  const handleToggle = async (player: Player) => {
    if (isUpdating) return;
    console.log(
      `🔄 Changement de joueur pour le jeu ${game.name} (${game._id}) : ${player.name} (${player._id})`
    );
    setIsUpdating(true);

    const alreadyIn = isPlayerInGame(player);

    const success = alreadyIn
      ? await removePlayerFromGame(game._id, player._id)
      : await addPlayerToGame(game._id, player._id);

    if (success) {
      await refetchGames(); // met à jour le contexte
    }

    setIsUpdating(false);
  };

  useEffect(() => {
    players.map((p) =>
      console.log(`🧑 Joueur : ${p.name} (${p._id})`, isPlayerInGame(p))
    ),
      "🔍 Vérification de la présence du joueur dans le jeu";
  }, [gameId, players, games]);

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
