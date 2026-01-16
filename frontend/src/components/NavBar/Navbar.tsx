import { useRef, useState } from "react";
import cx from "classnames";
import { Bars } from "../../assets/icons/Bars";
import { HelpModal } from "../Modals/HelpModal/HelpModal";
import { ThemeMenu } from "../ThemeSwitcher/ThemeMenu";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { Button, SecondaryButton } from "../Buttons/Button";
import { useGamesContext } from "../../contexts/gamesContext";
import { usePlayerContext } from "../../contexts/playersContext";
import type { Game, Player } from "../../types";
import { verifyAdminPassword } from "../../api/admin/verifyAdminPassword";
import s from "./Navbar.module.css";

type ImportPayload = {
  players?: Player[];
  games?: Game[];
};

export const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const [displayThemeSwitcher, setDisplayThemeSwitcher] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { games, addGame } = useGamesContext();
  const { players, addPlayer } = usePlayerContext();

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

  const getNormalizedName = (name: string) => name.trim().toLowerCase();

  const resolvePlayerId = (entry: unknown) => {
    if (typeof entry === "string") return entry;
    if (
      entry &&
      typeof entry === "object" &&
      "_id" in entry &&
      typeof (entry as { _id: unknown })._id === "string"
    ) {
      return (entry as { _id: string })._id;
    }
    return null;
  };

  const resolvePlayerName = (entry: unknown) => {
    if (
      entry &&
      typeof entry === "object" &&
      "name" in entry &&
      typeof (entry as { name: unknown }).name === "string"
    ) {
      return (entry as { name: string }).name;
    }
    return null;
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ImportPayload;

      const incomingPlayers = Array.isArray(data.players) ? data.players : [];
      const incomingGames = Array.isArray(data.games) ? data.games : [];

      const playersByName = new Map(
        players.map((player) => [getNormalizedName(player.name), player])
      );
      const playersById = new Map(players.map((player) => [player._id, player]));
      const playersByOldId = new Map<string, Player>();

      for (const incomingPlayer of incomingPlayers) {
        if (!incomingPlayer?.name) continue;
        const normalizedName = getNormalizedName(incomingPlayer.name);
        const existing = playersByName.get(normalizedName);
        if (existing) {
          if (incomingPlayer._id) {
            playersByOldId.set(incomingPlayer._id, existing);
          }
          continue;
        }

        const created = await addPlayer(incomingPlayer.name);
        if (created) {
          playersByName.set(normalizedName, created);
          if (incomingPlayer._id) {
            playersByOldId.set(incomingPlayer._id, created);
          }
        }
      }

      for (const incomingGame of incomingGames) {
        if (!incomingGame?.name) continue;

        const normalizedGameName = getNormalizedName(incomingGame.name);
        const existingGame = games.some(
          (game) => getNormalizedName(game.name) === normalizedGameName
        );
        if (existingGame) continue;

        const playerObjects = Array.isArray(incomingGame.players)
          ? incomingGame.players
              .map((entry) => {
                const oldId = resolvePlayerId(entry);
                if (oldId && playersByOldId.has(oldId)) {
                  return playersByOldId.get(oldId) as Player;
                }
                if (oldId && playersById.has(oldId)) {
                  return playersById.get(oldId) as Player;
                }
                const name = resolvePlayerName(entry);
                if (!name) return null;
                return playersByName.get(getNormalizedName(name)) || null;
              })
              .filter((player): player is Player => Boolean(player))
          : [];

        const minimumPlayers = Number(incomingGame.minimumPlayers) || 1;
        const maximumPlayers =
          Number(incomingGame.maximumPlayers) || minimumPlayers;

        await addGame({
          name: incomingGame.name,
          minimumPlayers,
          maximumPlayers,
          players: playerObjects,
          isNavGame: Boolean(incomingGame.isNavGame),
        });
      }
    } catch (error) {
      console.error("Import failed:", error);
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

  return (
    <nav
      className={cx(s.navbarContainer, isOpen ? s.openNavbar : s.closedNavbar)}
      onMouseLeave={() => {
        setOpen(false);
        setDisplayThemeSwitcher(false);
      }}
    >
      <Button
        onClick={() => {
          setOpen(!isOpen);
          setDisplayThemeSwitcher(false);
        }}
        label={<Bars />}
      />
      {isOpen && (
        <div className={s.navbar}>
          <ThemeMenu setDisplayThemeSwitcher={setDisplayThemeSwitcher} />
          {displayThemeSwitcher && <ThemeSwitcher />}
          <SecondaryButton
            label="Exporter JSON"
            onClick={async () => {
              if (!(await requireAdminPassword())) return;
              handleExport();
            }}
          />
          <SecondaryButton
            label="Importer JSON"
            onClick={async () => {
              if (!(await requireAdminPassword())) return;
              fileInputRef.current?.click();
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void handleImport(file);
              event.target.value = "";
            }}
            style={{ display: "none" }}
          />
          <HelpModal />
        </div>
      )}
    </nav>
  );
};
