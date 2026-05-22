/* ──────────────────────────────────────────────
   ÉCRAN 2 — CHAPITRE II : "Tu te connais ?"
   Quiz 5 questions
   ────────────────────────────────────────────── */

const QUESTIONS = [
  {
    q: "Où est-ce que Juliano t'a embrassée pour la première fois ?",
    options: ["Sur un pont", "Sur un banc à Toulouse", "Au cinéma", "Dans un café"],
    answer: 1,
  },
  {
    q: "Ta réplique la plus légendaire ?",
    options: ['"Oui absolument !"', '"Hmm peut-être..."', '"NON !"', '"Bof bof..."'],
    answer: 2,
  },
  {
    q: "Ton surnom le plus inattendu ?",
    options: ["Mon cœur", "Ma puce", "Mon cactus", "Ma chérie"],
    answer: 2,
  },
  {
    q: "Ton sport national ?",
    options: ["Le yoga", "Le shopping", "Râler", "La natation"],
    answer: 2,
  },
  {
    q: "Comment tu réagis quand quelque chose te plaît vraiment ?",
    options: ["Tu applaudis", "Tu sautes", "Tu fais semblant de pas aimer", "Tu cries"],
    answer: 2,
  },
];

function scoreMessage(score) {
  if (score <= 1) return "Tu te connais pas bien… ou t'as fait exprès 😏";
  if (score <= 3) return "Pas mal ! Mais Juliano te connaît mieux que toi-même 😄";
  if (score === 4) return "Presque ! Tu commences à te cerner 🎯";
  return "5/5 — Ombeline dans toute sa splendeur 👑";
}

function Chapter2({ onNext }) {
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(null);    // index picked
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const lockRef = useRef(false);

  const total = QUESTIONS.length;
  const progress = done ? 100 : (qIdx / total) * 100;

  const pick = (i) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setPicked(i);
    const correct = i === QUESTIONS[qIdx].answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      lockRef.current = false;
      if (qIdx + 1 >= total) {
        setDone(true);
      } else {
        setQIdx(qIdx + 1);
        setPicked(null);
      }
    }, 1200);
  };

  if (done) {
    return (
      <section className="screen screen-enter">
        <div className="progress-bar" style={{ width: '100%' }} />
        <div className="screen-narrow stack-md">
          <p className="eyebrow fade-up">Résultat</p>
          <h2
            className="display gradient-text fade-up"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 6rem)', animationDelay: '0.1s' }}
          >
            {score}/{total}
          </h2>
          <p
            className="italic-serif fade-up"
            style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
              color: 'var(--deep)',
              margin: '8px 0 0',
              animationDelay: '0.4s',
              textWrap: 'balance',
            }}
          >
            {scoreMessage(score)}
          </p>
          <div className="fade-up" style={{ animationDelay: '0.9s', marginTop: '32px' }}>
            <window.Button onClick={onNext}>Dernier chapitre 💌</window.Button>
          </div>
        </div>
      </section>
    );
  }

  const q = QUESTIONS[qIdx];

  return (
    <section className="screen screen-enter" key={qIdx}>
      <div className="progress-bar" style={{ width: progress + '%' }} />
      <div className="screen-narrow stack-md">
        <p className="eyebrow fade-up">
          Question {qIdx + 1} / {total}
        </p>
        <h2 className="quiz-question fade-up" style={{ animationDelay: '0.1s' }}>
          {q.q}
        </h2>
        <div className="quiz-options fade-up" style={{ animationDelay: '0.25s' }}>
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (picked !== null) {
              cls += ' locked';
              if (i === q.answer) cls += ' correct';
              else if (i === picked) cls += ' wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => pick(i)}
                disabled={picked !== null}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p className="juliano-reaction" key={qIdx + '-r'}>
            {picked === q.answer ? 'Juliano valide 🎉' : 'Juliano est déçu 😔'}
          </p>
        )}
      </div>
    </section>
  );
}

window.Chapter2 = Chapter2;
