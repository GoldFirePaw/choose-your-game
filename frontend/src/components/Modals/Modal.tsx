import { PlayerDetails } from "./PlayerDetails";
import { Button } from "../Buttons/Button";
import s from "./Modal.module.css";

type ModalProps = {
  modalContent: string;
  onClose: () => void;
  selectedPlayerId?: string;
};

export const Modal = ({ modalContent, onClose, selectedPlayerId }: ModalProps) => {
  const renderContent = () => {
    switch (modalContent) {
      case "playerDetails":
        return selectedPlayerId ? (
          <PlayerDetails playerId={selectedPlayerId} onClose={onClose} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.innerContent}>{renderContent()}</div>

        <div className={s.footer}>
          <Button label="Fermer" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
