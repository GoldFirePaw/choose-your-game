export const deleteGame = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3001/games/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete game');
    }

    return true;
  } catch (error) {
    console.error('Error deleting game:', error);
    return false;
  }
};