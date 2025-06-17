import { usePlayerContext } from "../contexts/playersContext";

export const PlayersList = () => {
  const { players, loading, deletePlayer } = usePlayerContext();

  if (loading) return <p>Chargement...</p>;

  return (
    <ul>
      {players.map((p) => (
        <li key={p._id}>
          {p.name}
          <button onClick={() => deletePlayer(p._id)}>❌</button>
        </li>
      ))}
    </ul>
  );
};
