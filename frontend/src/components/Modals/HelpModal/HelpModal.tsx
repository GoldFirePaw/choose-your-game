import { useState } from "react";
import s from "./HelpModal.module.css";
import { Button } from "../../Buttons/Button"; // adapte le chemin si besoin

export const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} label="❓ Aide" />

      {isOpen && (
        <div className={s.backdrop} onClick={() => setIsOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Aide rapide</h2>
            <div className={s.content}>
              <p>
                <strong>➕ Ajouter un jeu :</strong> entre son nom et le nombre
                de joueurs.
              </p>
              <p>
                <strong>🧑 Ajouter un joueur :</strong> entre un prénom simple.
              </p>
              <p>
                <strong>🎯 Clique sur ton pseudo</strong> pour éditer les jeux
                que tu possèdes (très important !).
              </p>
              <p>
                <strong>🛠 Modifier un jeu :</strong> clique sur ✏️ pour changer
                son nom ou les joueurs associés.
              </p>
              <p>
                <strong>👥 Sélectionner combien vous êtes :</strong> en cliquant
                sur les cercles.
              </p>
              <p>
                <strong>🔍 Clique sur un joueur :</strong> pour filtrer les jeux
                qu’il possède et compatibles avec le nombre de joueurs.
              </p>
            </div>

            <div className={s.footer}>
              <Button onClick={() => setIsOpen(false)} label="Fermer" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
