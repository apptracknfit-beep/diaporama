/* ──────────────────────────────────────────────
   ÉCRAN 4 — LE CADEAU
   Fond noir, suspense, "🌬️ PROUT", confettis massifs.
   ────────────────────────────────────────────── */

function Gift({ onNext }) {
  const [confettiLayer, fireConfetti] = window.useConfetti();
  const [phase, setPhase] = useState(0);
  // 0: fond noir, 1: "Ton cadeau est…", 2: pause, 3: PROUT + confettis, 4: tout

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => { setPhase(3); fireConfetti(120); }, 3600),
      setTimeout(() => { fireConfetti(80); }, 4200),
      setTimeout(() => setPhase(4), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [fireConfetti]);

  return (
    <div className="gift-screen fade-in" style={{ animationDuration: '0.5s' }}>
      {confettiLayer}

      {phase >= 1 && phase < 3 && (
        <p
          className="italic-serif fade-up"
          style={{
            fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)',
            color: 'var(--white)',
            opacity: 0.9,
            margin: 0,
          }}
        >
          Ton cadeau est…
        </p>
      )}

      {phase >= 3 && (
        <>
          <p
            className="italic-serif"
            style={{
              fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
              color: 'var(--white)',
              opacity: 0.7,
              margin: '0 0 20px',
            }}
          >
            Ton cadeau est…
          </p>
          <h1
            className="gift-prout"
            style={{ animation: 'bounceIn 0.9s cubic-bezier(.2,.8,.2,1) forwards' }}
          >
            🌬️ PROUT
          </h1>
        </>
      )}

      {phase >= 4 && (
        <>
          <p
            className="body-italic fade-up"
            style={{
              marginTop: '36px',
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              color: 'var(--white)',
              opacity: 0.9,
            }}
          >
            Joyeux anniversaire ma caca 🌵
          </p>
          <div className="fade-up" style={{ marginTop: '40px', animationDelay: '0.6s' }}>
            <window.Button onClick={onNext}>Accéder aux mini jeux 🎮</window.Button>
          </div>
        </>
      )}
    </div>
  );
}

window.Gift = Gift;
