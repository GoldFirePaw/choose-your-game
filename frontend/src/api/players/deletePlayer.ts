export const deletePlayer = async (
  id: string,
  adminPassword: string
): Promise<{ success: boolean; error?: string }> => {
  const API = import.meta.env.VITE_API_BASE_URL;
  console.log(
    "🚨 Suppression joueur avec mot de passe :",
    `${API}/players/${id}`
  );

  try {
    const response = await fetch(`${API}/players/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete player");
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting player:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
