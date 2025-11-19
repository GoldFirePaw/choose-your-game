import { useGamesContext } from "../../contexts/gamesContext";
import s from "./DataStatus.module.css";

export const DataStatus = () => {
  const { loading } = useGamesContext();

  return (
    <div className={s.status}>
      {loading ? (
        <span className={s.loading}>🔄 Chargement…</span>
      ) : (
        <span className={s.ok}>✅ Données à jour</span>
      )}
    </div>
  );
};
