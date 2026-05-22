/* ──────────────────────────────────────────────
   JEU 3 — Attrape le cactus
   Cactus qui se balade. Tap = surnom affiché.
   20 secondes.
   ────────────────────────────────────────────── */

const NICKNAMES = [
  'ma caca',
  'mon cactus',
  'mon sucre sucré au sucre',
  'ma râleuse',
  'mon NON préféré',
  'ma comédie préférée 🎬',
];

function CatchCactus({ onClose }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hugs, setHugs] = useState(0);
  const [time, setTime] = useState(20);
  const [nickname, setNickname] = useState(null);
  const [over, setOver] = useState(false);
  const stageRef = useRef(null);
  const nickIdRef = useRef(0);

  // Position roam
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setPos({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      });
    }, 800);
    return () => clearInterval(t);
  }, [over]);

  // Timer
  useEffect(() => {
    if (over) return;
    if (time <= 0) { setOver(true); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, over]);

  const tap = () => {
    if (over) return;
    setHugs((h) => h + 1);
    const next = NICKNAMES[(Math.random() * NICKNAMES.length) | 0];
    const id = ++nickIdRef.current;
    setNickname({ text: next, id });
    setTimeout(() => {
      setNickname((cur) => (cur && cur.id === id ? null : cur));
    }, 1000);
    // jump immediately to a new spot
    setPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
  };

  return (
    <div className="game-arena fade-in">
      <div className="game-topbar">
        <button className="close" onClick={onClose} aria-label="Fermer">✕</button>
        <div className="score">Câlins&nbsp;: <strong style={{ fontStyle: 'normal', color: 'var(--accent)' }}>{hugs}</strong></div>
        <div className="timer">{time}s</div>
      </div>
      <div className="game-stage" ref={stageRef}>
        {!over && (
          <span
            className="cactus"
            style={{
              left: `calc(${pos.x}% - 28px)`,
              top:  `calc(${pos.y}% - 28px)`,
            }}
            onClick={tap}
            role="button"
            aria-label="Attraper le cactus"
          >
            🌵
          </span>
        )}
        {nickname && (
          <span key={nickname.id} className="cactus-nickname">{nickname.text}</span>
        )}
        {over && (
          <div className="endgame fade-in">
            <div style={{ fontSize: '4rem' }}>🌵❤️</div>
            <h2>{hugs} câlins virtuels envoyés à Ombeline 🌵❤️</h2>
            <window.Button onClick={onClose}>Retour aux jeux</window.Button>
          </div>
        )}
      </div>
    </div>
  );
}

window.CatchCactus = CatchCactus;
