import { useState } from 'react';
import { usePlayerContext } from '../contexts/playersContext';

export const AddPlayerForm = () => {
  const [name, setName] = useState('');
  const { addPlayer } = usePlayerContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    await addPlayer(trimmedName);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un joueur</h2>
      <input
        type="text"
        placeholder="Nom du joueur"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
};