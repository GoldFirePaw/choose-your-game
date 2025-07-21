import { useState } from "react";
import { useGamesContext } from "../../contexts/gamesContext";
import styles from "./RefreshButton.module.css";

export const RefreshButton = () => {
  const { forceRefresh } = useGamesContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceRefresh();
      console.log("🔄 Manual refresh completed");
    } catch (error) {
      console.error("❌ Manual refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      className={styles.refreshButton}
      onClick={handleRefresh}
      disabled={isRefreshing}
      title="Refresh games data"
    >
      {isRefreshing ? (
        <span className={styles.spinner}>⟳</span>
      ) : (
        <span>🔄</span>
      )}
      {isRefreshing ? "Rechargement..." : "Recharger"}
    </button>
  );
};
