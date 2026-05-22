/* ──────────────────────────────────────────────
   APP — router + navigation pills
   ────────────────────────────────────────────── */

const SCREENS = [
  { id: 0, key: 'intro',    label: 'Intro',     Comp: 'Intro' },
  { id: 1, key: 'souvenirs',label: 'Souvenirs', Comp: 'Chapter1' },
  { id: 2, key: 'quiz',     label: 'Quiz',      Comp: 'Chapter2' },
  { id: 3, key: 'lettre',   label: 'Lettre',    Comp: 'Chapter3' },
  { id: 4, key: 'cadeau',   label: 'Cadeau',    Comp: 'Gift' },
  { id: 5, key: 'jeux',     label: 'Jeux',      Comp: 'Games' },
];

function App() {
  const [idx, setIdx] = useState(() => {
    const fromHash = parseInt((window.location.hash || '').replace('#', ''), 10);
    return Number.isFinite(fromHash) && fromHash >= 0 && fromHash < SCREENS.length ? fromHash : 0;
  });

  useEffect(() => {
    window.location.hash = String(idx);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [idx]);

  const goto = useCallback((next) => {
    setIdx(Math.max(0, Math.min(SCREENS.length - 1, next)));
  }, []);

  const next = () => goto(idx + 1);
  const prev = () => goto(idx - 1);

  const current = SCREENS[idx];
  const Screen = window[current.Comp];

  return (
    <div className="app">
      <window.Backdrop />
      <main className="screen-container" key={idx}>
        {Screen ? (
          <Screen onNext={next} onPrev={prev} goto={goto} />
        ) : (
          <div className="screen"><p>Loading {current.Comp}…</p></div>
        )}
      </main>
      <nav className="nav-pills" aria-label="Chapitres">
        {SCREENS.map((s) => (
          <button
            key={s.key}
            className={'nav-pill' + (s.id === idx ? ' active' : '')}
            aria-label={s.label}
            aria-current={s.id === idx ? 'page' : undefined}
            onClick={() => goto(s.id)}
          />
        ))}
      </nav>
    </div>
  );
}

window.App = App;
