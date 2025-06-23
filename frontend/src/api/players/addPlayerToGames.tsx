export async function addPlayerToGames(playerId: string, gameIds: string[]) {
  const res = await fetch(`/players/${playerId}/add-to-games`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameIds }),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de l'ajout du joueur aux jeux");
  }

  return res.json();
}
