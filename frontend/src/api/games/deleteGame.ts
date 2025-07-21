export const deleteGame = async (
  id: string,
  adminPassword: string
): Promise<{ success: boolean; error?: string }> => {
  const API = import.meta.env.VITE_API_BASE_URL;
  console.log("🚨 Suppression API avec mot de passe :", `${API}/games/${id}`);

  try {
    const response = await fetch(`${API}/games/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete game");
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Échec suppression API :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
