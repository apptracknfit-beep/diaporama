/* ──────────────────────────────────────────────
   UTILS — hooks & shared components
   ────────────────────────────────────────────── */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* Calcule le nombre de jours depuis une date au format YYYY-MM-DD. */
function daysSince(dateStr) {
  const start = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const ms = now - start;
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/* Hook : déclenche une vague de confettis. Renvoie [layer, trigger]. */
function useConfetti() {
  const [pieces, setPieces] = useState([]);
  const idRef = useRef(0);

  const trigger = useCallback((count = 80) => {
    const palette = ['#FFD700', '#F4C8D4', '#FFC1CC', '#E8C36B', '#FFE08A', '#F8B4C0'];
    const next = Array.from({ length: count }, () => {
      const id = idRef.current++;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.6;
      const duration = 2.6 + Math.random() * 2.2;
      const color = palette[(Math.random() * palette.length) | 0];
      const rot = (Math.random() * 360) | 0;
      const shape = Math.random() > 0.6 ? '50%' : '2px';
      const width = 6 + Math.random() * 8;
      const height = 10 + Math.random() * 10;
      return { id, left, delay, duration, color, rot, shape, width, height };
    });
    setPieces((prev) => [...prev, ...next]);
    // garbage collect after they fall
    setTimeout(() => {
      setPieces((prev) => prev.filter((p) => !next.find((n) => n.id === p.id)));
    }, 6000);
  }, []);

  const layer = (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti"
          style={{
            left: p.left + 'vw',
            background: p.color,
            width: p.width + 'px',
            height: p.height + 'px',
            borderRadius: p.shape,
            transform: `rotate(${p.rot}deg)`,
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </div>
  );

  return [layer, trigger];
}

/* Decorative background (gradient, blobs, grain) */
function Backdrop() {
  return (
    <>
      <div className="bg-stage" />
      <div className="bg-blob rose" />
      <div className="bg-blob gold" />
      <svg className="bg-grain" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
}

/* Bouton primaire */
function Button({ children, onClick, style, ghost, delay }) {
  return (
    <button
      className={'btn' + (ghost ? ' btn-ghost' : '') + ' fade-up'}
      style={{ animationDelay: (delay ?? 0) + 's', ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Object.assign(window, { daysSince, useConfetti, Backdrop, Button });
