import { usePlayerContext } from "../contexts/playersContext";
import type { Player } from "../types";
import s from "./selectedPlayersFilter.module.css";

type Props = {
  selected: Player[];
  onChange: (players: Player[]) => void;
};

export const SelectedPlayersFilter = ({ selected, onChange }: Props) => {
  const { players } = usePlayerContext();

  const toggle = (player: Player) => {
    const isSelected = selected.some((p) => p._id === player._id);
    const newSelection = isSelected
      ? selected.filter((p) => p._id !== player._id)
      : [...selected, player];

    onChange(newSelection);
  };

  return (
    <div>
      <h3>Joueurs présents</h3>
      <div className={s.playersContainer}>
        {players.map((player) => (
          <div key={player._id}>
            <label>
              <input
                type="checkbox"
                checked={selected.some((p) => p._id === player._id)}
                onChange={() => toggle(player)}
              />
              {player.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
