import type { Game, Player } from "../../types";

type ReplacePayload = {
  players: Player[];
  games: Game[];
  adminPassword: string;
};

type ReplaceResult =
  | { success: true; playersInserted: number; gamesInserted: number }
  | { success: false; error: string };

export const replaceData = async (
  payload: ReplacePayload
): Promise<ReplaceResult> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/admin/replace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Import failed",
      };
    }

    return {
      success: true,
      playersInserted: data.playersInserted ?? 0,
      gamesInserted: data.gamesInserted ?? 0,
    };
  } catch (error) {
    console.error("Error replacing data:", error);
    return { success: false, error: "Import failed" };
  }
};
