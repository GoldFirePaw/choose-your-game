import type { Game } from "../../types";

// Simple in-memory cache
let gameCache: { data: Game[]; timestamp: number } | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const getGames = async (useCache = true): Promise<Game[]> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  // Check cache first
  if (useCache && gameCache) {
    const now = Date.now();
    const cacheAge = now - gameCache.timestamp;

    if (cacheAge < CACHE_DURATION) {
      console.log(
        "� Using cached games data (age:",
        Math.round(cacheAge / 1000),
        "seconds)"
      );
      return gameCache.data;
    }
  }

  console.log("📡 Fetching fresh games data from API:", `${API}/games`);
  const startTime = Date.now();

  try {
    const response = await fetch(`${API}/games`, {
      // Add cache headers for better performance
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const fetchTime = Date.now() - startTime;
    console.log(
      `↩️ Response received in ${fetchTime}ms, status:`,
      response.status
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const totalTime = Date.now() - startTime;
    console.log(`✅ ${data.length} games loaded in ${totalTime}ms`);

    // Update cache
    gameCache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error("❌ Error loading games:", error);
    // Return cached data if available, otherwise empty array
    return gameCache?.data || [];
  }
};

// Function to clear cache (useful after adding/updating/deleting games)
export const clearGamesCache = () => {
  gameCache = null;
  console.log("🗑️ Games cache cleared");
};
