/* ──────────────────────────────────────────────
   JEU 2 — Memory
   Grille 4x4, 8 paires. Flip 3D.
   ────────────────────────────────────────────── */

const MEMORY_FACES = ['🌵', '💌', '🎬', '🍰', '🌙', '✨', '🌸', '🍯'];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  const pairs = MEMORY_FACES.flatMap((f, i) => [
    { id: i * 2,     face: f },
    { id: i * 2 + 1, face: f },
  ]);
  return shuffle(pairs);
}

function Memory({ onClose }) {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]); // indices currently face-up (not yet matched)
  const [matched, setMatched] = useState(new Set());
  const [tries, setTries] = useState(0);
  const lockRef = useRef(false);

  const allMatched = matched.size === deck.length;

  const onCardClick = (i) => {
    if (lockRef.current) return;
    if (flipped.includes(i)) return;
    if (matched.has(i)) return;

    const next = [...flipped, i];
    setFlipped(next);

    if (next.length === 2) {
      setTries((t) => t + 1);
      const [a, b] = next;
      if (deck[a].face === deck[b].face) {
        // match
        setTimeout(() => {
          setMatched((m) => new Set([...m, a, b]));
          setFlipped([]);
        }, 500);
      } else {
        lockRef.current = true;
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 900);
      }
    }
  };

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setTries(0);
  };

  return (
    <div className="game-arena fade-in">
      <div className="game-topbar">
        <button className="close" onClick={onClose} aria-label="Fermer">✕</button>
        <div className="score">Paires&nbsp;: <strong style={{ fontStyle: 'normal', color: 'var(--accent)' }}>{matched.size / 2} / {MEMORY_FACES.length}</strong></div>
        <div className="timer">{tries}<span style={{ fontSize: '0.9rem', marginLeft: 4, color: 'var(--ink-mute)', fontWeight: 400 }}>coups</span></div>
      </div>
      <div className="game-stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="memory-grid">
          {deck.map((c, i) => {
            const isFlipped = flipped.includes(i) || matched.has(i);
            return (
              <div
                key={c.id}
                className={'memory-card' + (isFlipped ? ' flipped' : '') + (matched.has(i) ? ' matched' : '')}
                onClick={() => onCardClick(i)}
              >
                <div className="memory-card-inner">
                  <div className="memory-face memory-back">🌵</div>
                  <div className="memory-face memory-front">{c.face}</div>
                </div>
              </div>
            );
          })}
        </div>
        {allMatched && (
          <div className="endgame fade-in">
            <div style={{ fontSize: '4rem' }}>🏆</div>
            <h2>Trouvées en {tries} coups !</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <window.Button onClick={restart}>Rejouer 🔁</window.Button>
              <window.Button ghost onClick={onClose}>Retour</window.Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.Memory = Memory;
