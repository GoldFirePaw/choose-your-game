export const deletePlayer = async (id: number): Promise<boolean> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete player");
    }

    return true;
  } catch (error) {
    console.error("Error deleting player:", error);
    return false;
  }
};
