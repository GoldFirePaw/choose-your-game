import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { addPlayer as apiAddPlayer } from '../api/players/addPlayer';
import type {Player } from '../types';
import { getPlayers } from '../api/players/getPlayers';
import { deletePlayer as apiDeletePlayer } from '../api/players/deletePlayer';

type PlayersContextType = {
  players: Player[];
  loading: boolean;
  addPlayer: (name: string) => Promise<void>;
  deletePlayer: (id: number) => Promise<void>;
};

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers().then((data) => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  const addPlayer = async (name: string) => {
    const newPlayer = await apiAddPlayer(name);
    if (newPlayer) {
      setPlayers((prev) => [...prev, newPlayer]);
    }
  };

const deletePlayer = async (id: number) => {
  const success = await apiDeletePlayer(id);
  if (success) {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  }
};

  return (
    <PlayersContext.Provider value={{ players, loading, addPlayer, deletePlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayersContext);
  if (!context) throw new Error('usePlayerContext must be used in a <PlayersProvider>');
  return context;
};