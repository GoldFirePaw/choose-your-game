import { usePlayerContext } from "../../contexts/playersContext";
import { SecondaryButton } from "../Buttons/Button";

type PlayerDetailsProps = {
  playerId: string;
  onClose: () => void;
};

export const PlayerDetails = ({ playerId, onClose }: PlayerDetailsProps) => {
  const { deletePlayer } = usePlayerContext();

  console.log("🧾 Affichage détails joueur");
  return (
    <div className="playerDetails">
      <h2>Player Details</h2>
      <p>Here you can view and edit player details.</p>
      <SecondaryButton
        onClick={() => {
          deletePlayer(playerId);
          onClose();
        }}
        label={"Supprimer le joueur"}
      />
    </div>
  );
};
