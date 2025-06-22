import { PlayerDetails } from "./PlayerDetails";
import { Button } from "../Buttons/Button";
import s from "./Modal.module.css";

type ModalProps = {
  modalContent: string;
  onClose: () => void;
  selectedPlayerId?: string; // Optional, used for player details
};

export const Modal = ({
  modalContent,
  onClose,
  selectedPlayerId,
}: ModalProps) => {
  const content = (() => {
    switch (modalContent) {
      case "playerDetails":
        return (
          selectedPlayerId && (
            <PlayerDetails playerId={selectedPlayerId} onClose={onClose} />
          )
        );
      default:
        return null;
    }
  })();

  return (
    <div className={s.modalBackdrop} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        {content}
        <Button label="Close" onClick={onClose} />
      </div>
    </div>
  );
};
