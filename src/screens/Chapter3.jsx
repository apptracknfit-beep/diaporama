/* ──────────────────────────────────────────────
   ÉCRAN 3 — CHAPITRE III : "Ma lettre"
   Confettis + enveloppe qui s'ouvre + machine à écrire
   ────────────────────────────────────────────── */

const LETTER = `Coucou mon coeur, 18 ans !
Je t'aime extrêmement fort. Je pense tout le temps à toi, chaque heures, chaque secondes. Je t'aime très très 99e99999 fort ❤❤❤
Aujourd'hui 18ans, tu en avais 16ans et même 15ans quand je t'ai connu. Tu es une persoonne incroybale que j'admire et que j'aime avoir a mes cotés.
J'espere que cette année sera reussite pour toi sur plusisurs plans (scolaire, physique, santé). Je t'aim très fort, merci pour les inombrables ousvniers que tu m'as créer et tout les reves qui arrivent. Je t'aime si fort passe une belle journée mon caca cactus sucré au sucre.
Je t'offre, une banane, un . . .. . . . KIIIIT KATTTT, mais encore ?
Un massage pour te detendre de toutes tes tentions et des soins Yves Rocher tu le mérites tellement !
Je t'aime super fort ❤
Juliano`;

function Chapter3({ onNext }) {
  const [confettiLayer, fireConfetti] = window.useConfetti();
  const [phase, setPhase] = useState('envelope'); // envelope → letter
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);
  const triggered = useRef(false);

  // Fire confetti once on mount
  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    fireConfetti(90);
    const t1 = setTimeout(() => fireConfetti(60), 600);
    return () => clearTimeout(t1);
  }, [fireConfetti]);

  // Envelope open → letter
  useEffect(() => {
    const t = setTimeout(() => setPhase('opening'), 600);
    const t2 = setTimeout(() => setPhase('letter'), 2200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Typewriter
  useEffect(() => {
    if (phase !== 'letter') return;
    if (typed >= LETTER.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setTyped(typed + 1), 30);
    return () => clearTimeout(t);
  }, [phase, typed]);

  return (
    <section className="screen screen-enter">
      {confettiLayer}
      <div className="screen-narrow stack-md" style={{ maxWidth: 600 }}>
        <p className="eyebrow fade-up">Chapitre III</p>
        <h2
          className="display fade-up"
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', animationDelay: '0.15s' }}
        >
          Ma lettre
        </h2>

        {phase !== 'letter' && (
          <div className="envelope-stage fade-up" style={{ animationDelay: '0.4s' }}>
            <div className={'envelope' + (phase === 'opening' ? ' open' : '')}>
              <span className="seal" aria-hidden="true">💌</span>
            </div>
          </div>
        )}

        {phase === 'letter' && (
          <div className="letter-card fade-up" style={{ animationDelay: '0s' }}>
            <span className="letter-stamp" aria-hidden="true">💌</span>
            <p className="letter-body">
              {LETTER.slice(0, typed)}
              {!done && <span className="letter-cursor" />}
            </p>
          </div>
        )}

        {done && (
          <div className="fade-up" style={{ marginTop: '32px' }}>
            <window.Button onClick={() => { fireConfetti(60); setTimeout(onNext, 200); }}>
              Réclamer ton cadeau 🎁
            </window.Button>
          </div>
        )}
      </div>
    </section>
  );
}

window.Chapter3 = Chapter3;
