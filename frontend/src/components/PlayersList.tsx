import { usePlayerContext } from "../contexts/playersContext";
import s from "./PlayersList.module.css";

export const PlayersList = () => {
  const { players, loading, deletePlayer } = usePlayerContext();

  if (loading) return <p>Chargement...</p>;

  return (
    <ul className={s.ul}>
      {players.map((p) => (
        <li key={p._id} className={s.li}>
          {p.name}
          <button onClick={() => deletePlayer(p._id)} className={s.button}>
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
};
