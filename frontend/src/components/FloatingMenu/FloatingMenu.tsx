import s from "./FloatingMenu.module.css";

export const FloatingMenu = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={s.nav}>
      <button onClick={() => scrollTo("active-players")}>🧍</button>
      <button onClick={() => scrollTo("games-list")}>🎮</button>
      <button onClick={() => scrollTo("add-game")}>➕🎮</button>
      <button onClick={() => scrollTo("add-player")}>➕🧍</button>

      {/* Home = retour en haut */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        🏠
      </button>
    </nav>
  );
};
