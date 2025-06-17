export const deletePlayer = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3001/players/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete player');
    }

    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
};