/* ──────────────────────────────────────────────
   ÉCRAN 0 — INTRO
   Compteur de jours + titre Ombeline + bouton
   ────────────────────────────────────────────── */

function Intro({ onNext }) {
  const days = window.daysSince('2024-09-07');

  return (
    <section className="screen screen-enter">
      <div className="screen-narrow">
        <div className="fade-up" style={{ fontSize: '3rem', animation: 'heartbeat 2.4s ease-in-out infinite', display: 'inline-block' }}>
          🎂
        </div>

        <p
          className="body-italic fade-up"
          style={{
            fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
            color: 'var(--ink-soft)',
            margin: '24px 0 28px',
            animationDelay: '0s',
          }}
        >
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--accent)', fontStyle: 'normal' }}>
            {days}
          </span>{' '}
          jours que tu râles à côté de moi.
        </p>

        <h1
          className="display display-xl gradient-text fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          Ombeline
        </h1>

        <p
          className="italic-serif fade-up"
          style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
            color: 'var(--accent)',
            margin: '8px 0 0',
            animationDelay: '1.1s',
          }}
        >
          a 18 ans.
        </p>

        <p
          className="body-italic fade-up"
          style={{
            fontSize: 'clamp(1rem, 2.6vw, 1.15rem)',
            color: 'var(--ink-soft)',
            margin: '36px 0 44px',
            maxWidth: '420px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5,
            animationDelay: '1.6s',
          }}
        >
          Trois chapitres. Une histoire. Rien que pour toi.
        </p>

        <window.Button onClick={onNext} delay={2.2}>
          Commencer ✨
        </window.Button>

        <p
          className="eyebrow fade-up"
          style={{ marginTop: '48px', animationDelay: '2.8s' }}
        >
          de Juliano · à Ombeline
        </p>
      </div>
    </section>
  );
}

window.Intro = Intro;
