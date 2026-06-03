import { useState, useEffect, useRef } from 'react';
import type { Route } from './+types/workout';
import { getPb } from '../lib/pb';

export function links() {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap',
    },
  ];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Workout Plan' },
    { name: 'description', content: 'Home gym workout tracker' },
  ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
type StrengthDay = 'mon' | 'wed' | 'fri';

interface Exercise {
  name: string;
  type: 'Compound' | 'Isolation';
  sets: number;
  reps: string;
  weight: string;
  strategy: 'pyramid' | 'straight';
}

interface Customization {
  name?: string;
  weight?: string;
}

type Customizations = Partial<Record<StrengthDay, Record<number, Customization>>>;

// ─── Data ─────────────────────────────────────────────────────────────────────

const LS_KEY = 'workout-customizations';

const WORKOUTS: Record<StrengthDay, Exercise[]> = {
  mon: [
    { name: 'DB Bench Press', type: 'Compound', sets: 3, reps: '8–10', weight: '25–32kg', strategy: 'pyramid' },
    { name: 'Incline DB Press', type: 'Compound', sets: 3, reps: '10', weight: '20–28kg', strategy: 'pyramid' },
    { name: 'Seated DB Arnold Press', type: 'Compound', sets: 3, reps: '10', weight: '12–18kg', strategy: 'pyramid' },
    { name: 'DB Lateral Raise', type: 'Isolation', sets: 3, reps: '15', weight: '8–12kg', strategy: 'straight' },
    { name: 'Push-ups on handles', type: 'Compound', sets: 3, reps: 'Max', weight: 'Bodyweight', strategy: 'straight' },
  ],
  wed: [
    { name: 'Goblet Squat (KB)', type: 'Compound', sets: 3, reps: '10', weight: '24–32kg', strategy: 'pyramid' },
    { name: 'Step-up (onto bench)', type: 'Compound', sets: 3, reps: '10 each', weight: '12–20kg', strategy: 'pyramid' },
    { name: 'Deficit Reverse Lunge', type: 'Compound', sets: 3, reps: '10 each', weight: '16–22kg', strategy: 'straight' },
    { name: 'Glute Bridge (DB on hips)', type: 'Compound', sets: 3, reps: '15', weight: '20–30kg', strategy: 'straight' },
    { name: 'Calf Raise', type: 'Isolation', sets: 3, reps: '20', weight: 'Hold DBs', strategy: 'straight' },
  ],
  fri: [
    { name: 'Single-Arm DB Row (supported)', type: 'Compound', sets: 3, reps: '10 each', weight: '28–36kg', strategy: 'pyramid' },
    { name: 'Seated DB Row (on bench edge)', type: 'Compound', sets: 3, reps: '10', weight: '20–28kg', strategy: 'pyramid' },
    { name: 'DB Bicep Curl', type: 'Isolation', sets: 3, reps: '10', weight: '16–22kg', strategy: 'straight' },
    { name: 'Hammer Curl', type: 'Isolation', sets: 3, reps: '12', weight: '14–18kg', strategy: 'straight' },
    { name: 'Dead Bug (bodyweight core)', type: 'Isolation', sets: 3, reps: '10 each side', weight: 'Bodyweight', strategy: 'straight' },
  ],
};

const DAYS: { id: Day; label: string; type: 'strength' | 'cardio'; sub: string }[] = [
  { id: 'mon', label: 'Mon', type: 'strength', sub: 'Push' },
  { id: 'tue', label: 'Tue', type: 'cardio', sub: 'Cardio' },
  { id: 'wed', label: 'Wed', type: 'strength', sub: 'Lower' },
  { id: 'thu', label: 'Thu', type: 'cardio', sub: 'Cardio' },
  { id: 'fri', label: 'Fri', type: 'strength', sub: 'Pull' },
];

const SESSION_HEADERS: Record<Day, { title: string; sub: string }> = {
  mon: { title: 'Monday — Upper Push', sub: 'Chest · Shoulders · Triceps' },
  tue: { title: 'Tuesday — Cardio', sub: '20–30 min · Active recovery' },
  wed: { title: 'Wednesday — Lower Body', sub: 'Quads · Glutes · Hamstrings · Calves' },
  thu: { title: 'Thursday — Cardio', sub: '20–30 min · Active recovery' },
  fri: { title: 'Friday — Pull + Core', sub: 'Back · Biceps · Abs' },
};

// ─── EditableField ────────────────────────────────────────────────────────────

interface EditableFieldProps {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}

function EditableField({ value, onChange, style }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
    else setDraft(value);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setEditing(false); setDraft(value); }
        }}
        style={{
          ...style,
          background: 'transparent',
          outline: 'none',
          border: 'none',
          borderBottom: '1px solid #888',
          color: 'inherit',
          font: 'inherit',
          width: `${Math.max(draft.length, 4)}ch`,
          padding: 0,
        }}
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      title="Click to edit"
      style={{
        ...style,
        cursor: 'text',
        borderBottom: '1px dashed transparent',
        transition: 'border-color 0.15s',
        display: 'inline-block',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderBottomColor = '#555')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent')}
    >
      {value}
    </span>
  );
}

// ─── ExerciseCard ─────────────────────────────────────────────────────────────

interface ExerciseCardProps {
  index: number;
  exercise: Exercise;
  completedSets: boolean[];
  onSetToggle: (setIndex: number) => void;
  onReset: () => void;
  onNameChange: (name: string) => void;
  onWeightChange: (weight: string) => void;
}

function ExerciseCard({
  index,
  exercise,
  completedSets,
  onSetToggle,
  onReset,
  onNameChange,
  onWeightChange,
}: ExerciseCardProps) {
  const isCompound = exercise.type === 'Compound';
  const isPyramid = exercise.strategy === 'pyramid';

  return (
    <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#2a2a2a', minWidth: 32, lineHeight: 1, flexShrink: 0 }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <EditableField
            value={exercise.name}
            onChange={onNameChange}
            style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: '#f5f2ee' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 20,
              background: isCompound ? 'rgba(30,95,194,0.12)' : 'rgba(217,100,10,0.12)',
              color: isCompound ? '#5b9bf8' : '#f4954a',
            }}>
              {exercise.type}
            </span>
            <span style={{ fontSize: 12, color: '#888' }}>{exercise.sets} × {exercise.reps}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <EditableField
            value={exercise.weight}
            onChange={onWeightChange}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.5px', color: '#f5f2ee', lineHeight: 1 }}
          />
          <div style={{ fontSize: 10, color: isPyramid ? '#5b9bf8' : '#f4954a', marginTop: 3 }}>
            {isPyramid ? '↑ Pyramid up' : '— Straight sets'}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #2a2a2a', padding: '12px 16px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {completedSets.map((done, n) => (
          <button
            key={n}
            onClick={() => onSetToggle(n)}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: done ? '2px solid #e03e2d' : '2px solid #2a2a2a',
              background: done ? '#e03e2d' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600,
              color: done ? '#fff' : '#888',
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {done ? '✓' : n + 1}
          </button>
        ))}
        <button
          onClick={onReset}
          style={{
            marginLeft: 'auto', fontSize: 11, color: '#888', cursor: 'pointer',
            padding: '4px 8px', borderRadius: 6, background: 'transparent',
            border: '1px solid #2a2a2a', transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#2a2a2a')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ─── CardioPanel ──────────────────────────────────────────────────────────────

const CARDIO_OPTIONS = [
  { icon: '🔥', title: 'HIIT Circuit', desc: '20–25 min · Jumping jacks, burpees, mountain climbers, high knees · 40s on / 20s off' },
  { icon: '🏃', title: 'Brisk Walk or Run', desc: '30 min outdoors · Zone 2 heart rate (able to hold a conversation)' },
  { icon: '🧘', title: 'Finish with foam roller', desc: '5 min · Focus on quads, hamstrings, upper back' },
];

function CardioPanel() {
  return (
    <div style={{ background: 'rgba(26,158,95,0.08)', border: '1px solid rgba(26,158,95,0.2)', borderRadius: 12, padding: '20px 16px', marginTop: 8 }}>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, color: '#1a9e5f', marginBottom: 12 }}>
        Choose Your Format
      </h3>
      {CARDIO_OPTIONS.map((opt, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
            borderBottom: i < CARDIO_OPTIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{opt.icon}</span>
          <div>
            <strong style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#f5f2ee' }}>{opt.title}</strong>
            <span style={{ fontSize: 12, color: '#888', marginTop: 2, display: 'block' }}>{opt.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GuideSection ─────────────────────────────────────────────────────────────

const PROG_RULES = [
  { icon: '📈', text: 'All sets feel easy with 2+ reps left in tank → add 2kg next week' },
  { icon: '📉', text: "Can't complete target reps → hold the weight or drop slightly" },
  { icon: '🎯', text: 'Aim to progress at least once every 1–2 weeks' },
];

function GuideSection() {
  return (
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #2a2a2a' }}>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, marginBottom: 14, color: '#888' }}>
        Set Strategy
      </h3>

      <div style={{ background: 'rgba(30,95,194,0.12)', border: '1px solid rgba(91,155,248,0.2)', borderRadius: 12, padding: 16, marginBottom: 10 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#5b9bf8', marginBottom: 6 }}>Pyramid Up (Compound lifts)</h4>
        <p style={{ fontSize: 13, color: 'rgba(245,242,238,0.7)', lineHeight: 1.6 }}>
          Start lighter, increase each set. Last set should be your hardest working weight.
        </p>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, fontSize: 12, color: '#f5f2ee', letterSpacing: '0.3px' }}>
          20kg → 28kg → 34kg → 36kg
        </div>
      </div>

      <div style={{ background: 'rgba(217,100,10,0.12)', border: '1px solid rgba(244,149,74,0.2)', borderRadius: 12, padding: 16, marginBottom: 10 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f4954a', marginBottom: 6 }}>Straight Sets (Isolation lifts)</h4>
        <p style={{ fontSize: 13, color: 'rgba(245,242,238,0.7)', lineHeight: 1.6 }}>
          Same weight all sets. Last 2–3 reps should feel genuinely hard.
        </p>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, fontSize: 12, color: '#f5f2ee', letterSpacing: '0.3px' }}>
          10kg × 15 reps  ·  10kg × 15 reps  ·  10kg × 15 reps
        </div>
      </div>

      <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, padding: 16, marginTop: 10 }}>
        <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1, marginBottom: 10, color: '#f5f2ee' }}>Progression Rule</h4>
        {PROG_RULES.map((rule, i) => (
          <div
            key={i}
            style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0',
              fontSize: 13, color: 'rgba(245,242,238,0.75)',
              borderBottom: i < PROG_RULES.length - 1 ? '1px solid #2a2a2a' : 'none',
            }}
          >
            <span style={{ flexShrink: 0 }}>{rule.icon}</span>
            <span>{rule.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkoutPage() {
  const [activeDay, setActiveDay] = useState<Day>('mon');
  const [customizations, setCustomizations] = useState<Customizations>({});
  // completedSets is session-only — not persisted
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});

  const recordIdRef = useRef<string | null>(null);
  const loadedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Silently authenticate then load customizations from PocketBase
  useEffect(() => {
    const pb = getPb();

    async function init() {
      try {
        // Reuse existing valid session; otherwise sign in with env credentials
        if (!pb.authStore.isValid) {
          const email = import.meta.env.VITE_PB_EMAIL as string;
          const password = import.meta.env.VITE_PB_PASSWORD as string;
          if (!email || !password) throw new Error('PB credentials not set');
          await pb.collection('users').authWithPassword(email, password);
        }

        const userId = pb.authStore.record?.id;
        if (!userId) throw new Error('No user id');

        const record = await pb.collection('workout_customizations')
          .getFirstListItem(`user="${userId}"`);
        recordIdRef.current = record.id;
        setCustomizations(record['data'] as Customizations);
        try { localStorage.setItem(LS_KEY, JSON.stringify(record['data'])); } catch {}
      } catch {
        // No PB record yet or offline — load from localStorage
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setCustomizations(JSON.parse(raw));
        } catch {}
      } finally {
        loadedRef.current = true;
      }
    }

    init();
  }, []);

  // Save to localStorage immediately + debounce save to PocketBase
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(customizations)); } catch {}
    if (!loadedRef.current) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const pb = getPb();
      const userId = pb.authStore.record?.id;
      if (!userId) return;
      try {
        if (recordIdRef.current) {
          await pb.collection('workout_customizations').update(recordIdRef.current, { data: customizations });
        } else {
          const rec = await pb.collection('workout_customizations').create({ user: userId, data: customizations });
          recordIdRef.current = rec.id;
        }
      } catch (err) {
        console.error('PocketBase save failed', err);
      }
    }, 1000);
  }, [customizations]);

  function getExercise(day: StrengthDay, i: number): Exercise {
    const base = WORKOUTS[day][i];
    const custom = customizations[day]?.[i];
    return { ...base, name: custom?.name ?? base.name, weight: custom?.weight ?? base.weight };
  }

  function updateCustomization(day: StrengthDay, i: number, patch: Partial<Customization>) {
    setCustomizations(prev => ({
      ...prev,
      [day]: { ...prev[day], [i]: { ...prev[day]?.[i], ...patch } },
    }));
  }

  function toggleSet(day: StrengthDay, exerciseIdx: number, setIdx: number) {
    const key = `${day}-${exerciseIdx}`;
    setCompletedSets(prev => {
      const current = prev[key] ?? Array(WORKOUTS[day][exerciseIdx].sets).fill(false);
      const next = [...current];
      next[setIdx] = !next[setIdx];
      return { ...prev, [key]: next };
    });
  }

  function resetSets(day: StrengthDay, exerciseIdx: number) {
    const key = `${day}-${exerciseIdx}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: Array(WORKOUTS[day][exerciseIdx].sets).fill(false),
    }));
  }

  function renderStrengthDay(day: StrengthDay) {
    return WORKOUTS[day].map((_, i) => {
      const ex = getExercise(day, i);
      const key = `${day}-${i}`;
      return (
        <ExerciseCard
          key={i}
          index={i}
          exercise={ex}
          completedSets={completedSets[key] ?? Array(ex.sets).fill(false)}
          onSetToggle={n => toggleSet(day, i, n)}
          onReset={() => resetSets(day, i)}
          onNameChange={name => updateCustomization(day, i, { name })}
          onWeightChange={weight => updateCustomization(day, i, { weight })}
        />
      );
    });
  }

  const { title, sub } = SESSION_HEADERS[activeDay];

  return (
    <div style={{ background: '#0d0d0d', color: '#f5f2ee', fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.5, minHeight: '100vh' }}>

      <header style={{ background: '#e03e2d', padding: '32px 20px 24px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 180, position: 'absolute', right: -10, top: -20, color: 'rgba(0,0,0,0.15)', letterSpacing: -4, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
          LIFT
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: 2, lineHeight: 1, position: 'relative' }}>
          Home Gym<br />Workout Plan
        </h1>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.75)', marginTop: 6, position: 'relative' }}>
          Dumbbells up to 42kg · Kettlebell · Bench · Push-up Handles
        </p>
      </header>

      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid #2a2a2a' }}>
        {DAYS.map((day, i) => {
          const isActive = activeDay === day.id;
          const isStrength = day.type === 'strength';
          return (
            <div
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              style={{
                padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                borderRight: i < DAYS.length - 1 ? '1px solid #2a2a2a' : 'none',
                background: isActive ? '#e03e2d' : isStrength ? 'rgba(224,62,45,0.08)' : 'rgba(26,158,95,0.08)',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1, display: 'block', color: isActive ? '#fff' : isStrength ? '#e03e2d' : '#1a9e5f' }}>
                {day.label}
              </span>
              <span style={{ fontSize: 10, fontWeight: 500, color: isActive ? 'rgba(255,255,255,0.7)' : '#888', display: 'block', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {day.sub}
              </span>
            </div>
          );
        })}
      </nav>

      <main style={{ padding: '0 16px 48px' }}>
        <div style={{ padding: '24px 0 16px', borderBottom: '1px solid #2a2a2a', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 1.5, lineHeight: 1 }}>{title}</h2>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{sub}</p>
        </div>

        {activeDay === 'tue' || activeDay === 'thu' ? (
          <CardioPanel />
        ) : (
          <>
            {renderStrengthDay(activeDay)}
            {activeDay === 'mon' && <GuideSection />}
          </>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '24px 16px', fontSize: 11, color: '#555', borderTop: '1px solid #2a2a2a' }}>
        Click exercise names and weights to edit · Changes saved automatically
      </footer>
    </div>
  );
}
