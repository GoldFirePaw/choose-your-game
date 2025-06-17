export const deleteGame = async (id: string): Promise<boolean> => {
  const API = import.meta.env.VITE_API_BASE_URL;
  console.log("🚨 Suppression API :", `${API}/games/${id}`);
  try {
    const response = await fetch(`${API}/games/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete game");
    }

    return true;
  } catch (error) {
    console.error("❌ Échec suppression API :", error);
    return false;
  }
};
