/* ──────────────────────────────────────────────
   ÉCRAN 1 — CHAPITRE I : "Nos souvenirs"
   Diaporama des 126 photos classées par date.
   Le cadre s'adapte à la taille naturelle de chaque photo.
   Bouton "Passer les photos" toujours visible.
   ────────────────────────────────────────────── */

function fmtDateFr(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
  if (!m) return '';
  const months = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  return parseInt(m[3], 10) + ' ' + months[parseInt(m[2], 10) - 1] + ' ' + m[1];
}

function Chapter1({ onNext }) {
  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const stageRef = useRef(null);

  // Load manifest
  useEffect(() => {
    fetch('slides/manifest.json', { cache: 'no-cache' })
      .then((r) => r.json())
      .then((data) => { setSlides(data); setLoading(false); })
      .catch(() => { setErr(true); setLoading(false); });
  }, []);

  // Compute frame dimensions from photo aspect ratio + viewport
  const recomputeSize = useCallback(() => {
    const s = slides[idx];
    if (!s || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const innerPad = 24;       // padding interne du cadre
    const captionRoom = 56;    // espace pour la légende + bouton
    const maxW = Math.max(120, rect.width  - 24);
    const maxH = Math.max(120, rect.height - innerPad - captionRoom);
    const ratio = s.width / s.height;
    let w = maxW;
    let h = w / ratio;
    if (h > maxH) { h = maxH; w = h * ratio; }
    // Ne jamais agrandir au-delà de la taille native
    if (w > s.width)  { w = s.width;  h = w / ratio; }
    if (h > s.height) { h = s.height; w = h * ratio; }
    setFrameSize({ w: Math.round(w + innerPad), h: Math.round(h + innerPad) });
  }, [slides, idx]);

  useEffect(() => { recomputeSize(); }, [recomputeSize]);
  useEffect(() => {
    const onResize = () => recomputeSize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [recomputeSize]);

  // Reset loaded state when idx changes
  useEffect(() => { setImgLoaded(false); }, [idx]);

  // Preload neighbors
  useEffect(() => {
    if (!slides.length) return;
    [1, 2, -1].forEach((d) => {
      const j = idx + d;
      if (j >= 0 && j < slides.length) {
        const p = new Image();
        p.src = 'slides/' + slides[j].file;
      }
    });
  }, [slides, idx]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || !slides.length) return;
    timerRef.current = setTimeout(() => {
      setIdx((i) => Math.min(slides.length - 1, i + 1));
    }, 3500);
    return () => clearTimeout(timerRef.current);
  }, [autoplay, idx, slides.length]);

  const go = (delta) => {
    setIdx((i) => Math.max(0, Math.min(slides.length - 1, i + delta)));
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { setAutoplay(false); go(1); }
      else if (e.key === 'ArrowLeft') { setAutoplay(false); go(-1); }
      else if (e.key === 'Escape')   { onNext && onNext(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, onNext]);

  // Touch swipe
  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
  };
  const onTouchEnd = (e) => {
    if (!touchRef.current.active) return;
    touchRef.current.active = false;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      setAutoplay(false);
      go(dx < 0 ? 1 : -1);
    }
  };

  if (loading) {
    return (
      <section className="screen screen-enter">
        <div className="screen-narrow stack-md" style={{ textAlign: 'center' }}>
          <p className="eyebrow fade-up">Chapitre I</p>
          <h2 className="display fade-up" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>Nos souvenirs</h2>
          <p className="body-italic fade-up" style={{ color: 'var(--ink-soft)' }}>chargement des photos…</p>
        </div>
      </section>
    );
  }

  if (err || !slides.length) {
    return (
      <section className="screen screen-enter">
        <div className="screen-narrow stack-md" style={{ textAlign: 'center' }}>
          <p className="eyebrow fade-up">Chapitre I</p>
          <h2 className="display fade-up">Nos souvenirs</h2>
          <p className="body-italic fade-up">Impossible de charger les photos.</p>
          <div className="fade-up" style={{ marginTop: 24 }}>
            <window.Button onClick={onNext}>Chapitre suivant 🎬</window.Button>
          </div>
        </div>
      </section>
    );
  }

  const current = slides[idx];
  const isLast = idx === slides.length - 1;

  return (
    <section className="screen screen-enter slideshow-screen">
      <div className="slideshow-wrap">
        <div className="slideshow-head">
          <p className="eyebrow">Chapitre I — Nos souvenirs</p>
          <p className="slideshow-counter">{idx + 1} / {slides.length}</p>
        </div>

        <div
          className="slideshow-stage"
          ref={stageRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="slideshow-arrow left"
            onClick={() => { setAutoplay(false); go(-1); }}
            disabled={idx === 0}
            aria-label="Précédent"
          >‹</button>

          <div
            className={'slideshow-frame' + (imgLoaded ? ' ready' : '')}
            style={{
              width: frameSize.w ? frameSize.w + 'px' : 'auto',
              height: frameSize.h ? frameSize.h + 'px' : 'auto',
            }}
          >
            <img
              src={'slides/' + current.file}
              alt={'Photo ' + (idx + 1)}
              onLoad={() => setImgLoaded(true)}
              draggable="false"
            />
          </div>

          <button
            className="slideshow-arrow right"
            onClick={() => { setAutoplay(false); go(1); }}
            disabled={isLast}
            aria-label="Suivant"
          >›</button>
        </div>

        <div className="slideshow-foot">
          <p className="slideshow-date">{fmtDateFr(current.date)}</p>

          <div className="slideshow-progress">
            <div
              className="slideshow-progress-bar"
              style={{ width: (((idx + 1) / slides.length) * 100) + '%' }}
            />
          </div>

          <div className="slideshow-actions">
            <button
              className="slideshow-mini"
              onClick={() => setAutoplay((a) => !a)}
              aria-label={autoplay ? 'pause' : 'lecture auto'}
            >
              {autoplay ? '❚❚ pause' : '▶ auto'}
            </button>

            {isLast ? (
              <window.Button onClick={onNext}>Chapitre suivant 🎬</window.Button>
            ) : (
              <window.Button onClick={onNext} ghost>Passer les photos →</window.Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Chapter1 = Chapter1;
