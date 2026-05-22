/* ──────────────────────────────────────────────
   ÉCRAN 5 — MINI JEUX
   Hub + lance chacun des 3 jeux
   ────────────────────────────────────────────── */

function Games() {
  const [active, setActive] = useState(null); // 'non' | 'memory' | 'cactus' | null

  if (active === 'non')    return <window.CatchNon    onClose={() => setActive(null)} />;
  if (active === 'memory') return <window.Memory      onClose={() => setActive(null)} />;
  if (active === 'cactus') return <window.CatchCactus onClose={() => setActive(null)} />;

  const games = [
    {
      id: 'non',
      icon: '🙅‍♀️',
      title: 'Attrape les NON !',
      blurb: 'Éclate les bulles qui tombent. 15 secondes pour battre le record.',
    },
    {
      id: 'memory',
      icon: '🎯',
      title: 'Memory',
      blurb: 'Huit paires à retrouver. Compte tes coups, vise le sans-faute.',
    },
    {
      id: 'cactus',
      icon: '🌵',
      title: 'Attrape le cactus',
      blurb: 'Un cactus qui se balade. Tape, récolte les surnoms. 20 secondes.',
    },
  ];

  return (
    <section className="screen screen-enter">
      <div className="screen-narrow stack-md">
        <p className="eyebrow fade-up">Chapitre bonus</p>
        <h2
          className="display fade-up"
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', animationDelay: '0.1s' }}
        >
          Mini jeux 🎮
        </h2>
        <p
          className="body-italic fade-up"
          style={{ color: 'var(--ink-soft)', animationDelay: '0.25s', marginTop: '-4px' }}
        >
          Trois jeux, pour râler encore un peu plus.
        </p>

        <div className="games-grid" style={{ marginTop: '24px' }}>
          {games.map((g, i) => (
            <button
              key={g.id}
              className="game-card fade-up"
              style={{ animationDelay: 0.4 + i * 0.15 + 's' }}
              onClick={() => setActive(g.id)}
            >
              <div className="icon">{g.icon}</div>
              <div>
                <h3>{g.title}</h3>
                <p>{g.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Games = Games;
