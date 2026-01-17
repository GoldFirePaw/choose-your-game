import { useRef, useState } from "react";
import { Button, SecondaryButton } from "../Buttons/Button";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
import type { Game, Player } from "../../types";
import { verifyAdminPassword } from "../../api/admin/verifyAdminPassword";
import { replaceData } from "../../api/admin/replaceData";
import s from "./DataTransfer.module.css";

type ImportPayload = {
  players?: Player[];
  games?: Game[];
};

export const DataTransfer = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { games, forceRefresh } = useGamesContext();
  const { players, refetchPlayers } = usePlayerContext();

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      players,
      games,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `choose-your-game-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ImportPayload;

      const incomingPlayers = Array.isArray(data.players) ? data.players : [];
      const incomingGames = Array.isArray(data.games) ? data.games : [];
      if (incomingPlayers.length === 0 && incomingGames.length === 0) {
        window.alert("Aucune donnee a importer.");
        return;
      }

      const adminPassword = window.prompt("Mot de passe admin :");
      if (!adminPassword) return;

      const result = await replaceData({
        players: incomingPlayers,
        games: incomingGames,
        adminPassword,
      });

      if (!result.success) {
        window.alert(result.error || "Import echoue.");
        return;
      }

      await Promise.all([refetchPlayers(), forceRefresh()]);

      window.alert(
        `Import termine. Joueurs: ${result.playersInserted}. Jeux: ${result.gamesInserted}.`
      );
    } catch (error) {
      console.error("Import failed:", error);
      window.alert("Import echoue. Verifie le format du fichier.");
    }
  };

  const requireAdminPassword = async () => {
    const adminPassword = window.prompt("Mot de passe admin :");
    if (!adminPassword) return false;
    const isValid = await verifyAdminPassword(adminPassword);
    if (!isValid) {
      window.alert("Mot de passe invalide.");
    }
    return isValid;
  };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    void (async () => {
      await handleImport(file);
    })();
  };

  return (
    <section className={s.panel}>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>Import / Export</h2>
          <p className={s.subtitle}>
            Exporte un JSON ou depose un fichier pour importer.
          </p>
        </div>
        <Button
          label="Exporter JSON"
          onClick={() => {
            void (async () => {
              if (!(await requireAdminPassword())) return;
              handleExport();
            })();
          }}
          size="small"
        />
      </div>

      <div
        className={`${s.dropZone} ${isDragging ? s.dropZoneActive : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          handleFileSelect(file);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            handleFileSelect(file);
            event.target.value = "";
          }}
        />
        <div className={s.dropText}>
          <span>Glisse ton fichier JSON ici</span>
          <SecondaryButton
            label="Choisir un fichier"
            size="small"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
      </div>
    </section>
  );
};
