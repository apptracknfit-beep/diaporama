/* ──────────────────────────────────────────────
   JEU 1 — Attrape les NON !
   Bulles "NON !" qui tombent du haut.
   Tap = +1. 15 secondes.
   ────────────────────────────────────────────── */

function CatchNon({ onClose }) {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [over, setOver] = useState(false);
  const stageRef = useRef(null);
  const idRef = useRef(0);
  const rafRef = useRef(null);

  // Spawn loop
  useEffect(() => {
    if (over) return;
    const spawnTimer = setInterval(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const w = stage.clientWidth;
      const id = idRef.current++;
      const x = 30 + Math.random() * Math.max(0, w - 110);
      const speed = 100 + Math.random() * 80; // px/s
      setBubbles((b) => [...b, { id, x, y: -90, speed, popped: false }]);
    }, 450);
    return () => clearInterval(spawnTimer);
  }, [over]);

  // Animate fall
  useEffect(() => {
    if (over) return;
    let last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const stage = stageRef.current;
      const h = stage ? stage.clientHeight : 800;
      setBubbles((bs) =>
        bs
          .map((b) => (b.popped ? b : { ...b, y: b.y + b.speed * dt }))
          .filter((b) => b.y < h + 100)
      );
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [over]);

  // Timer
  useEffect(() => {
    if (over) return;
    if (time <= 0) { setOver(true); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, over]);

  const pop = (id) => {
    setBubbles((bs) => bs.map((b) => (b.id === id && !b.popped ? { ...b, popped: true } : b)));
    setScore((s) => s + 1);
    setTimeout(() => {
      setBubbles((bs) => bs.filter((b) => b.id !== id));
    }, 280);
  };

  return (
    <div className="game-arena fade-in">
      <div className="game-topbar">
        <button className="close" onClick={onClose} aria-label="Fermer">✕</button>
        <div className="score">Score : <strong style={{ fontStyle: 'normal', color: 'var(--accent)' }}>{score}</strong></div>
        <div className="timer">{time}s</div>
      </div>
      <div className="game-stage" ref={stageRef}>
        {bubbles.map((b) => (
          <div
            key={b.id}
            className={'non-bubble' + (b.popped ? ' non-pop' : '')}
            style={{
              left: b.x + 'px',
              top: b.y + 'px',
            }}
            onClick={() => !b.popped && pop(b.id)}
          >
            NON !
          </div>
        ))}
        {over && (
          <div className="endgame fade-in">
            <div style={{ fontSize: '4rem' }}>🙅‍♀️</div>
            <h2>
              Tu as attrapé {score} NON !<br/>
              Ombeline en a encore 9999 en stock 😂
            </h2>
            <window.Button onClick={onClose}>Retour aux jeux</window.Button>
          </div>
        )}
      </div>
    </div>
  );
}

window.CatchNon = CatchNon;
