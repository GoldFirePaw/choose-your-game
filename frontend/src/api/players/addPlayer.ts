import type { Player } from "../../types";

export const addPlayer = async (name: string): Promise<Player | null> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to add player");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding player:", error);
    return null;
  }
};
