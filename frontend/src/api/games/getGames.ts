export const getGames = async () => {
  try {
    const response = await fetch('http://localhost:3001/games');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}