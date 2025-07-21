import { useGamesContext } from "../../contexts/gamesContext";
import { RefreshButton } from "../RefreshButton/RefreshButton";
import styles from "./DataStatus.module.css";

export const DataStatus = () => {
  const { loading } = useGamesContext();

  return (
    <div className={styles.dataStatus}>
      <div className={styles.statusInfo}>
        {loading ? (
          <span className={styles.loading}>🔄 Chargement...</span>
        ) : (
          <span className={styles.fresh}>✅ Données à jour</span>
        )}
      </div>
      <RefreshButton />
    </div>
  );
};
