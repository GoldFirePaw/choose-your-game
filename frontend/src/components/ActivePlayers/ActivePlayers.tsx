import { usePlayerContext } from "../../contexts/playersContext";
import type { Player } from "../../types";
import s from "./ActivePlayers.module.css";

type Props = {
  selected: Player[];
  onChange: (players: Player[]) => void;
  setModalContent: (content: string) => void;
};

export const ActivePlayers = ({
  selected,
  onChange,
  setModalContent,
}: Props) => {
  const { players, handleSelectPlayer } = usePlayerContext();

  const toggle = (player: Player) => {
    const isSelected = selected.some((p) => p._id === player._id);
    const newSelection = isSelected
      ? selected.filter((p) => p._id !== player._id)
      : [...selected, player];

    onChange(newSelection);
  };

  const handleClick = (playerId: string) => {
    handleSelectPlayer(playerId);
    setModalContent("playerDetails");
    console.log("🔍 Affichage des détails du joueur");
  };

  return (
    <div>
      <h3>Joueurs présents</h3>
      <p className={s.instructions}>
        Cliquez sur un joueur pour voir ses détails. Cochez pour l'ajouter à la
        partie.
      </p>
      <div className={s.playersContainer}>
        {players.map((player) => (
          <div
            onClick={() => {
              handleClick(player._id);
            }}
            className={s.playerContainer}
            key={player._id}
          >
            <label onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selected.some((p) => p._id === player._id)}
                onChange={() => toggle(player)}
              />
            </label>
            {player.name}
          </div>
        ))}
      </div>
    </div>
  );
};
