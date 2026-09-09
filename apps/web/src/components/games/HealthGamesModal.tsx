'use client';

import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  X,
  Trophy,
  Sparkles,
  RefreshCw,
  Heart,
  Pill,
  Dna,
  Activity,
  Flame,
  Award,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

type GameMode = 'MENU' | 'VIRUS_HUNTER' | 'PILL_SORT' | 'DNA_MATCHER' | 'HEARTBEAT_RHYTHM';

export const HealthGamesModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameMode>('MENU');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(120);
  const [triviaFact, setTriviaFact] = useState<string | null>(null);

  // --- VIRUS HUNTER STATE ---
  interface Target {
    id: number;
    type: 'virus' | 'wbc';
    x: number;
    y: number;
  }
  const [targets, setTargets] = useState<Target[]>([]);
  const [virusTimer, setVirusTimer] = useState(25);

  // --- DNA MATCHER STATE ---
  const [dnaQuestion, setDnaQuestion] = useState<{ base: 'A' | 'T' | 'C' | 'G'; pair: 'T' | 'A' | 'G' | 'C' }>({
    base: 'A',
    pair: 'T'
  });

  // --- PILL SORT STATE ---
  interface PillItem {
    id: number;
    name: string;
    slot: 'Morning (AM)' | 'Night (PM)';
  }
  const [currentPill, setCurrentPill] = useState<PillItem>({
    id: 1,
    name: 'Metformin 500mg',
    slot: 'Morning (AM)'
  });

  // --- HEARTBEAT RHYTHM STATE ---
  const [pulseScale, setPulseScale] = useState(1);
  const [tapFeedback, setTapFeedback] = useState<string | null>(null);

  // Educational medical facts
  const medicalFacts = [
    "White blood cells (neutrophils & lymphocytes) make up about 1% of your total blood, but are essential for fighting off billions of microbes daily!",
    "In human DNA, Adenine always bonds with Thymine with 2 hydrogen bonds, while Cytosine pairs with Guanine with 3 hydrogen bonds.",
    "Your heart beats approximately 100,000 times a day, pumping around 2,000 gallons of blood through 60,000 miles of blood vessels!",
    "Taking blood pressure medications at consistent times each morning or night helps regulate the natural circadian drop in vascular tension.",
    "Platelets live for only 7 to 10 days in the human body, requiring your bone marrow to produce millions every second."
  ];

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTriviaFact(medicalFacts[Math.floor(Math.random() * medicalFacts.length)]);
  };

  // Virus Hunter interval loop
  useEffect(() => {
    if (activeGame !== 'VIRUS_HUNTER' || virusTimer <= 0) return;

    const timerInterval = setInterval(() => {
      setVirusTimer((prev) => {
        if (prev <= 1) {
          triggerCelebration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnInterval = setInterval(() => {
      setTargets((prev) => [
        ...prev.slice(-6),
        {
          id: Date.now() + Math.random(),
          type: Math.random() > 0.3 ? 'virus' : 'wbc',
          x: 10 + Math.random() * 80,
          y: 15 + Math.random() * 70
        }
      ]);
    }, 800);

    return () => {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
    };
  }, [activeGame, virusTimer]);

  const handleHitTarget = (target: Target) => {
    if (target.type === 'virus') {
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 15));
    }
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  // DNA Base match click
  const handleDnaChoice = (selected: 'A' | 'T' | 'C' | 'G') => {
    if (selected === dnaQuestion.pair) {
      setScore((s) => s + 20);
      triggerCelebration();
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
    const bases: Array<'A' | 'T' | 'C' | 'G'> = ['A', 'T', 'C', 'G'];
    const pairs: Record<'A' | 'T' | 'C' | 'G', 'A' | 'T' | 'C' | 'G'> = {
      A: 'T',
      T: 'A',
      C: 'G',
      G: 'C'
    };
    const nextBase = bases[Math.floor(Math.random() * bases.length)];
    setDnaQuestion({ base: nextBase, pair: pairs[nextBase] });
  };

  // Pill sort click
  const handlePillSort = (choice: 'Morning (AM)' | 'Night (PM)') => {
    if (choice === currentPill.slot) {
      setScore((s) => s + 15);
      triggerCelebration();
    } else {
      setScore((s) => Math.max(0, s - 5));
    }

    const pills: PillItem[] = [
      { id: 2, name: 'Atorvastatin 20mg', slot: 'Night (PM)' },
      { id: 3, name: 'Vitamin D3 60,000 IU', slot: 'Morning (AM)' },
      { id: 4, name: 'Melatonin 3mg', slot: 'Night (PM)' },
      { id: 5, name: 'Omega-3 Fish Oil', slot: 'Morning (AM)' }
    ];
    setCurrentPill(pills[Math.floor(Math.random() * pills.length)]);
  };

  // Heartbeat pulse animation
  useEffect(() => {
    if (activeGame !== 'HEARTBEAT_RHYTHM') return;
    const interval = setInterval(() => {
      setPulseScale(1.4);
      setTimeout(() => setPulseScale(1), 250);
    }, 1000); // 60 BPM
    return () => clearInterval(interval);
  }, [activeGame]);

  const handleHeartbeatTap = () => {
    if (pulseScale > 1.2) {
      setScore((s) => s + 25);
      setTapFeedback('PERFECT SYSTOLIC TIMING! (+25)');
      triggerCelebration();
    } else {
      setScore((s) => Math.max(0, s - 5));
      setTapFeedback('MISSED PEAK — TAP ON PULSE! (-5)');
    }
    setTimeout(() => setTapFeedback(null), 700);
  };

  return (
    <>
      {/* Floating "Health Fun" Launcher Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setActiveGame('MENU');
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 transition-all border border-cyan-400/40"
      >
        <Gamepad2 className="w-5 h-5 animate-spin-slow" />
        <span className="tracking-wide">Health Fun</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(56,189,248,0.2)] p-6 md:p-8 overflow-hidden text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">MediScan Health Fun</h3>
                  <p className="text-xs text-slate-400">
                    Interactive clinical educational mini-games & medical trivia.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-white/10 text-xs font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Score: {score}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Game Views */}
            <div className="py-6 min-h-[340px] flex flex-col justify-center">
              {activeGame === 'MENU' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Game 1: Virus Hunter */}
                  <button
                    onClick={() => {
                      setActiveGame('VIRUS_HUNTER');
                      setScore(0);
                      setVirusTimer(25);
                      setTargets([]);
                    }}
                    className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-white/10 hover:border-cyan-400/40 text-left transition-all group space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">
                      🦠
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      Virus Hunter
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Neutralize invading viral pathogens before time expires. Avoid friendly white blood cells!
                    </p>
                  </button>

                  {/* Game 2: Pill Sort */}
                  <button
                    onClick={() => {
                      setActiveGame('PILL_SORT');
                      setScore(0);
                    }}
                    className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-white/10 hover:border-cyan-400/40 text-left transition-all group space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Pill className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      Pill Sort Challenge
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Match common medications to correct morning (AM) or night (PM) dosage schedules.
                    </p>
                  </button>

                  {/* Game 3: DNA Matcher */}
                  <button
                    onClick={() => {
                      setActiveGame('DNA_MATCHER');
                      setScore(0);
                    }}
                    className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-white/10 hover:border-cyan-400/40 text-left transition-all group space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Dna className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      DNA Base Matcher
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Pair Adenine (A), Thymine (T), Cytosine (C), and Guanine (G) in rapid nucleotide succession.
                    </p>
                  </button>

                  {/* Game 4: Heartbeat Rhythm */}
                  <button
                    onClick={() => {
                      setActiveGame('HEARTBEAT_RHYTHM');
                      setScore(0);
                    }}
                    className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-white/10 hover:border-cyan-400/40 text-left transition-all group space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      Heartbeat Rhythm (60 BPM)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tap precisely on the systolic cardiac peak to synchronize sinus rhythm.
                    </p>
                  </button>
                </div>
              )}

              {/* GAME 1: VIRUS HUNTER */}
              {activeGame === 'VIRUS_HUNTER' && (
                <div className="relative h-72 w-full bg-slate-950 rounded-2xl border border-white/10 overflow-hidden select-none">
                  <div className="absolute top-2 left-3 text-xs text-cyan-400 font-mono">
                    Time Left: {virusTimer}s
                  </div>
                  <div className="absolute top-2 right-3 text-xs text-slate-400 font-mono">
                    Click 🦠 (+10) | Avoid ⚪ (-15)
                  </div>

                  {targets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleHitTarget(t)}
                      style={{ left: `${t.x}%`, top: `${t.y}%` }}
                      className="absolute p-2 rounded-full transition-transform active:scale-75 text-2xl -translate-x-1/2 -translate-y-1/2"
                    >
                      {t.type === 'virus' ? '🦠' : '⚪'}
                    </button>
                  ))}

                  {virusTimer === 0 && (
                    <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center space-y-3">
                      <h4 className="text-xl font-bold text-emerald-400">Round Completed!</h4>
                      <p className="text-sm text-slate-200 font-mono">Final Score: {score}</p>
                      <button
                        onClick={() => setActiveGame('MENU')}
                        className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs"
                      >
                        Back to Menu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* GAME 2: PILL SORT */}
              {activeGame === 'PILL_SORT' && (
                <div className="text-center space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 max-w-sm mx-auto space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono">
                      Medicine Schedule Question
                    </span>
                    <h4 className="text-xl font-black text-white">{currentPill.name}</h4>
                    <p className="text-xs text-slate-400">When should this medicine typically be taken?</p>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handlePillSort('Morning (AM)')}
                      className="px-6 py-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      ☀️ Morning (AM)
                    </button>
                    <button
                      onClick={() => handlePillSort('Night (PM)')}
                      className="px-6 py-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      🌙 Night (PM)
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveGame('MENU')}
                    className="text-xs text-slate-400 hover:text-white block mx-auto underline pt-2"
                  >
                    Back to Games Menu
                  </button>
                </div>
              )}

              {/* GAME 3: DNA BASE MATCHER */}
              {activeGame === 'DNA_MATCHER' && (
                <div className="text-center space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 max-w-sm mx-auto space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono">
                      Target Nucleotide Base
                    </span>
                    <div className="text-5xl font-black text-cyan-300 font-mono py-2">
                      {dnaQuestion.base}
                    </div>
                    <p className="text-xs text-slate-400">Select complementary Watson-Crick base pair:</p>
                  </div>

                  <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                    {(['A', 'T', 'C', 'G'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => handleDnaChoice(b)}
                        className="p-4 rounded-xl bg-slate-950 border border-white/10 hover:border-cyan-400 font-black text-lg text-white hover:bg-cyan-500/20 transition-all font-mono"
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveGame('MENU')}
                    className="text-xs text-slate-400 hover:text-white block mx-auto underline pt-2"
                  >
                    Back to Games Menu
                  </button>
                </div>
              )}

              {/* GAME 4: HEARTBEAT RHYTHM */}
              {activeGame === 'HEARTBEAT_RHYTHM' && (
                <div className="text-center space-y-6">
                  <div className="flex flex-col items-center justify-center p-6">
                    <button
                      onClick={handleHeartbeatTap}
                      style={{ transform: `scale(${pulseScale})`, transition: 'transform 0.15s ease-out' }}
                      className="w-24 h-24 rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] cursor-pointer"
                    >
                      <Heart className="w-12 h-12 fill-rose-500 text-rose-500" />
                    </button>
                    <p className="text-xs text-slate-400 mt-4">
                      Tap the heart exactly when it beats! (Target: 60 BPM)
                    </p>
                    {tapFeedback && (
                      <span className="text-xs font-bold font-mono text-cyan-300 mt-2 block animate-bounce">
                        {tapFeedback}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveGame('MENU')}
                    className="text-xs text-slate-400 hover:text-white block mx-auto underline"
                  >
                    Back to Games Menu
                  </button>
                </div>
              )}
            </div>

            {/* Medical Educational Trivia Footer */}
            {triviaFact && (
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block mb-0.5">Medical Fact:</strong>
                  {triviaFact}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
