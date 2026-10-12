/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Exercise, WorkoutDay, StudentProfile, ShareableWorkoutPayload } from './types';
import { WORKOUTS, DAY_ORDER, DAY_SHORT, DEFAULT_GYM_COVER } from './data/workouts';
import { FinishModal } from './components/FinishModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CoverPhotoPickerModal } from './components/CoverPhotoPickerModal';
import { ExercisePickerModal } from './components/ExercisePickerModal';
import { ShareModal } from './components/ShareModal';
import { VideoModal } from './components/VideoModal';
import { decodeSharePayload } from './utils/sharing';
import { safeStorage } from './utils/safeStorage';

const STORE_KEY = "mt_state_v3";

function loadInitialState(): AppState {
  try {
    const raw =
      safeStorage.getItem(STORE_KEY) ||
      safeStorage.getItem("mt_state_v2") ||
      safeStorage.getItem("mt_state_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      const isLegacyCover =
        !parsed.coverPhotoUrl ||
        parsed.coverPhotoUrl.startsWith("data:image") ||
        parsed.coverPhotoUrl.includes("photo-1534438327276");

      return {
        loads: parsed.loads || {},
        sets: parsed.sets || {},
        completedDays: parsed.completedDays || {},
        coverPhotoUrl: isLegacyCover ? DEFAULT_GYM_COVER : parsed.coverPhotoUrl,
        customWorkouts: parsed.customWorkouts || {},
        profile: parsed.profile || {},
      };
    }
  } catch (e) {
    console.warn("Failed to load initial state safely", e);
  }
  return {
    loads: {},
    sets: {},
    completedDays: {},
    coverPhotoUrl: DEFAULT_GYM_COVER,
    customWorkouts: {},
    profile: {},
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(loadInitialState);
  const [currentView, setCurrentView] = useState<'home' | 'workout'>('home');
  const [selectedDay, setSelectedDay] = useState<string>('seg');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Exercise editing modal state
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Student sharing modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingSharedPayload, setPendingSharedPayload] = useState<ShareableWorkoutPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-app video player modal state
  const [videoExercise, setVideoExercise] = useState<Exercise | null>(null);

  // Expose openVideoModal globally to support external triggers and script calls
  useEffect(() => {
    (window as unknown as { openVideoModal: (exName: string, rawUrl: string) => void }).openVideoModal = (
      exName: string,
      rawUrl: string
    ) => {
      setVideoExercise({
        id: 'open-video-' + Date.now(),
        name: exName,
        video: rawUrl,
        sets: 4,
        reps: '8–12',
        rest: '60s',
        equip: '',
        load: true,
      });
    };
    return () => {
      delete (window as unknown as { openVideoModal?: unknown }).openVideoModal;
    };
  }, []);

  // Save state on change
  useEffect(() => {
    try {
      safeStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Storage save ignored", e);
    }
  }, [state]);

  // Check URL hash for shared workout payload (#treino=...)
  useEffect(() => {
    const handleUrlHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#treino=')) {
        const encoded = hash.slice(8);
        const payload = decodeSharePayload(encoded);
        if (payload && payload.customWorkouts) {
          setPendingSharedPayload(payload);
        }
      }
    };

    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    return () => window.removeEventListener('hashchange', handleUrlHash);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Accept incoming shared workout from teacher
  const handleAcceptSharedWorkout = () => {
    if (!pendingSharedPayload) return;

    setState((prev) => ({
      ...prev,
      customWorkouts: pendingSharedPayload.customWorkouts || prev.customWorkouts,
      profile: pendingSharedPayload.profile || prev.profile,
      coverPhotoUrl: pendingSharedPayload.coverPhotoUrl || prev.coverPhotoUrl,
      // Reset current checks for the new student
      sets: {},
      completedDays: {},
    }));

    setPendingSharedPayload(null);
    showToast('Ficha de treino do aluno carregada com sucesso!');
    // Clean URL hash without reloading
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleDeclineSharedWorkout = () => {
    setPendingSharedPayload(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Determine current day of week (seg..sex)
  const todayKey = useMemo(() => {
    const day = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const map: Record<number, string> = { 1: "seg", 2: "ter", 3: "qua", 4: "qui", 5: "sex" };
    return map[day] || null;
  }, []);

  const isWeekend = !todayKey;
  const defaultShowKey = todayKey || "seg";

  // Helper to get active workout (custom or default)
  const getWorkoutForDay = (dayKey: string): WorkoutDay => {
    if (state.customWorkouts && state.customWorkouts[dayKey]) {
      return state.customWorkouts[dayKey];
    }
    return WORKOUTS[dayKey] || WORKOUTS.seg;
  };

  // All active workouts map
  const activeWorkoutsMap = useMemo(() => {
    const map: Record<string, WorkoutDay> = {};
    DAY_ORDER.forEach((key) => {
      map[key] = getWorkoutForDay(key);
    });
    return map;
  }, [state.customWorkouts]);

  const getExerciseSets = (exId: string, totalSets: number): boolean[] => {
    if (!state.sets[exId] || state.sets[exId].length !== totalSets) {
      const existing = state.sets[exId] || [];
      const newArr = new Array(totalSets).fill(false);
      for (let i = 0; i < Math.min(totalSets, existing.length); i++) {
        newArr[i] = existing[i];
      }
      return newArr;
    }
    return state.sets[exId];
  };

  const isExerciseDone = (exId: string, totalSets: number): boolean => {
    const sets = getExerciseSets(exId, totalSets);
    return sets.length > 0 && sets.every(Boolean);
  };

  const getDayProgress = (dayKey: string) => {
    const w = getWorkoutForDay(dayKey);
    if (!w || !w.ex) return { done: 0, total: 0 };
    let done = 0;
    w.ex.forEach((e) => {
      if (isExerciseDone(e.id, e.sets)) done++;
    });
    return { done, total: w.ex.length };
  };

  const toggleSet = (exId: string, setIndex: number, totalSets: number) => {
    const current = getExerciseSets(exId, totalSets);
    const updated = [...current];
    updated[setIndex] = !updated[setIndex];
    setState((prev) => ({
      ...prev,
      sets: {
        ...prev.sets,
        [exId]: updated,
      },
    }));
  };

  const updateLoad = (exId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      loads: {
        ...prev.loads,
        [exId]: value,
      },
    }));
  };

  const handleFinishWorkout = (dayKey: string) => {
    const prog = getDayProgress(dayKey);
    if (prog.done !== prog.total) return;
    setState((prev) => ({
      ...prev,
      completedDays: {
        ...prev.completedDays,
        [dayKey]: true,
      },
    }));
    setShowFinishModal(true);
  };

  const handleResetWeek = () => {
    setState((prev) => ({
      ...prev,
      sets: {},
      completedDays: {},
    }));
    setShowResetConfirm(false);
    showToast('Semana reiniciada. Suas cargas foram mantidas!');
  };

  const handleSelectCoverPhoto = (url: string) => {
    setState((prev) => ({
      ...prev,
      coverPhotoUrl: url,
    }));
  };

  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setState((prev) => ({
      ...prev,
      profile: newProfile,
    }));
  };

  const handleImportPayload = (payload: ShareableWorkoutPayload) => {
    setState((prev) => ({
      ...prev,
      customWorkouts: payload.customWorkouts || prev.customWorkouts,
      profile: payload.profile || prev.profile,
      coverPhotoUrl: payload.coverPhotoUrl || prev.coverPhotoUrl,
      sets: {},
      completedDays: {},
    }));
    showToast('Ficha de treino importada com sucesso!');
  };

  // Workout customization handlers
  const openSwapExercise = (ex: Exercise) => {
    setEditingExercise(ex);
    setShowExerciseModal(true);
  };

  const openAddExercise = () => {
    setEditingExercise(null);
    setShowExerciseModal(true);
  };

  const handleSaveExercise = (newEx: Exercise, isNew: boolean) => {
    const currentDayWorkout = getWorkoutForDay(selectedDay);
    let updatedExercises: Exercise[];

    if (isNew) {
      updatedExercises = [...currentDayWorkout.ex, newEx];
    } else {
      updatedExercises = currentDayWorkout.ex.map((item) =>
        item.id === newEx.id ? newEx : item
      );
    }

    const updatedDayWorkout: WorkoutDay = {
      ...currentDayWorkout,
      ex: updatedExercises,
    };

    setState((prev) => ({
      ...prev,
      customWorkouts: {
        ...(prev.customWorkouts || {}),
        [selectedDay]: updatedDayWorkout,
      },
      sets: {
        ...prev.sets,
        [newEx.id]: new Array(newEx.sets).fill(false),
      },
    }));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const currentDayWorkout = getWorkoutForDay(selectedDay);
    const updatedExercises = currentDayWorkout.ex.filter((item) => item.id !== exerciseId);
    const updatedDayWorkout: WorkoutDay = {
      ...currentDayWorkout,
      ex: updatedExercises,
    };

    setState((prev) => ({
      ...prev,
      customWorkouts: {
        ...(prev.customWorkouts || {}),
        [selectedDay]: updatedDayWorkout,
      },
    }));
  };

  const handleResetDayWorkout = (dayKey: string) => {
    setState((prev) => {
      const updated = { ...(prev.customWorkouts || {}) };
      delete updated[dayKey];
      return {
        ...prev,
        customWorkouts: updated,
      };
    });
    showToast(`Treino de ${WORKOUTS[dayKey].label.toLowerCase()} restaurado ao padrão.`);
  };

  const goToWorkout = (dayKey: string) => {
    setSelectedDay(dayKey);
    setCurrentView('workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sparkles = [
    { left: -6, top: 22, size: 3 },
    { left: 198, top: 4, size: 2 },
    { left: -8, top: 252, size: 2 },
    { left: 206, top: 214, size: 3 },
  ];

  const currentWorkout = getWorkoutForDay(selectedDay);
  const homeDisplayWorkout = getWorkoutForDay(defaultShowKey);
  const currentCoverPhoto = state.coverPhotoUrl || DEFAULT_GYM_COVER;
  const isDayCustomized = Boolean(state.customWorkouts?.[selectedDay]);

  return (
    <div id="app">
      {/* Toast message banner */}
      {toastMessage && (
        <div className="toast-banner">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Prompt when opening shared workout URL */}
      {pendingSharedPayload && (
        <div className="modal-overlay open" style={{ zIndex: 120 }}>
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center', padding: '28px 22px' }}>
            <div style={{ fontSize: '38px', marginBottom: '8px' }}>🏋️‍♂️</div>
            <h3 className="modal-title" style={{ fontSize: '22px', margin: '0 0 8px' }}>
              Ficha de Treino Recebida!
            </h3>
            <p style={{ fontSize: '13.5px', color: 'rgba(245,242,235,0.85)', margin: '0 0 16px', lineHeight: 1.5 }}>
              {pendingSharedPayload.profile?.studentName ? (
                <>
                  Ficha personalizada para <b>{pendingSharedPayload.profile.studentName}</b>
                  {pendingSharedPayload.profile.trainerName ? (
                    <> preparada por <b>{pendingSharedPayload.profile.trainerName}</b>.</>
                  ) : '.'}
                </>
              ) : (
                'Seu professor compartilhou uma ficha de treino personalizada com você.'
              )}
            </p>
            {pendingSharedPayload.profile?.goal && (
              <div
                style={{
                  background: 'rgba(200, 153, 88, 0.1)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: 'var(--gold-light)',
                  marginBottom: '18px',
                }}
              >
                <b>Foco:</b> {pendingSharedPayload.profile.goal}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="confirm-cancel"
                onClick={handleDeclineSharedWorkout}
                style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
              >
                Recusar
              </button>
              <button
                className="btn-primary"
                onClick={handleAcceptSharedWorkout}
                style={{ flex: 1.6, padding: '12px' }}
              >
                Carregar Ficha ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'home' ? (
        <div className="view">
          {/* HERO */}
          <div className="hero">
            <div className="hero-glow" />
            <div className="hero-photo-wrap">
              <div className="hero-photo-frame">
                <div className="hero-photo-glow" />
                <img
                  className="hero-photo"
                  src={currentCoverPhoto || DEFAULT_GYM_COVER}
                  alt="Capa de Academia"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.dataset.fallbackApplied) {
                      img.dataset.fallbackApplied = 'true';
                      img.src = DEFAULT_GYM_COVER;
                    }
                  }}
                />
                {sparkles.map((sp, idx) => (
                  <span
                    key={idx}
                    className="hero-sparkle"
                    style={{
                      left: `${sp.left}px`,
                      top: `${sp.top}px`,
                      width: `${sp.size}px`,
                      height: `${sp.size}px`,
                    }}
                  />
                ))}

                {/* Change photo button on cover */}
                <button
                  className="change-photo-badge"
                  onClick={() => setShowPhotoPicker(true)}
                  title="Trocar foto de academia"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Capa</span>
                </button>
              </div>
            </div>

            <div className="hero-text">
              <p className="hero-eyebrow">FEITO ESPECIALMENTE PARA VOCÊ</p>
              <h1 className="hero-title">ÉLAN</h1>
              <p className="hero-sub">Não diminua a carga dos seus objetivos. Torne-se forte o bastante para sustentá-los.</p>

              {/* Student Profile Badge if set */}
              {state.profile?.studentName && (
                <div
                  className="student-profile-badge"
                  onClick={() => setShowShareModal(true)}
                  title="Clique para ver ou editar detalhes do aluno"
                >
                  <span className="student-avatar">👤</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="student-name">
                      Aluno(a): {state.profile.studentName}
                    </div>
                    <div className="student-sub">
                      {state.profile.trainerName ? `Prof. ${state.profile.trainerName}` : 'Personal'}
                      {state.profile.goal ? ` • ${state.profile.goal}` : ''}
                    </div>
                  </div>
                  <span className="badge-edit-icon">✏️</span>
                </div>
              )}

              {/* Share button trigger for Teachers / Students */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
                <button
                  className="btn-share-trigger"
                  onClick={() => setShowShareModal(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Compartilhar com Alunos
                </button>
              </div>
            </div>
          </div>

          {/* CARD DO DIA */}
          <div className="section">
            <div className="card today-card">
              {isWeekend ? (
                <>
                  <p className="today-label">HOJE</p>
                  <h2 className="today-day">Dia de descanso</h2>
                  <p className="today-detail">Aproveite para recuperar. Seu próximo treino:</p>
                  <p className="today-focus">{homeDisplayWorkout.label} · {homeDisplayWorkout.focus}</p>
                  <p className="today-detail">{homeDisplayWorkout.sub}</p>
                </>
              ) : (
                <>
                  <p className="today-label">TREINO DE HOJE</p>
                  <h2 className="today-day">{homeDisplayWorkout.label}</h2>
                  <p className="today-focus">{homeDisplayWorkout.focus}</p>
                  <p className="today-detail">{homeDisplayWorkout.sub}</p>
                </>
              )}

              <button
                className="btn-primary"
                onClick={() => goToWorkout(defaultShowKey)}
                style={{ marginTop: '6px' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                COMEÇAR TREINO
              </button>

              {/* DAY PILLS */}
              <div className="day-nav">
                {DAY_ORDER.map((k) => {
                  const prog = getDayProgress(k);
                  const isDone = prog.done === prog.total && prog.total > 0;
                  const isToday = k === todayKey;
                  let cls = "day-pill";
                  if (isToday) cls += " is-today";
                  if (isDone) cls += " is-done";

                  return (
                    <button
                      key={k}
                      className={cls}
                      onClick={() => goToWorkout(k)}
                    >
                      {DAY_SHORT[k]}
                      <span className="dot">
                        {isDone ? "✓" : isToday ? "●" : "·"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="day-nav-hint">Toque em qualquer dia para ver aquele treino</p>
            </div>
          </div>

          {/* MINHA SEMANA */}
          <div className="section">
            <div className="card">
              <p className="week-title">MINHA SEMANA</p>
              <div className="week-row">
                {DAY_ORDER.map((k) => {
                  const prog = getDayProgress(k);
                  const isDone = prog.done === prog.total && prog.total > 0;
                  return (
                    <div key={k} className="week-item">
                      <div className={`week-check ${isDone ? 'done' : ''}`}>
                        {isDone ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : null}
                      </div>
                      <div className="lbl">{DAY_SHORT[k]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COMO EVOLUIR */}
          <div className="section">
            <div className="card evoluir">
              <p className="week-title" style={{ marginBottom: '12px' }}>COMO EVOLUIR</p>
              <p>
                Quando aparecer <b style={{ color: 'var(--marble-cream)' }}>4 × 8–12</b>, significa 4 séries buscando ficar entre 8 e 12 repetições.
              </p>
              <p>
                Use uma resistência que torne as últimas repetições realmente desafiadoras, sem perder a execução correta.
              </p>
              <p>Evolução típica:</p>
              <span className="evoluir-ex">10 / 10 / 9 / 8</span> → <span className="evoluir-ex">11 / 11 / 10 / 10</span> → <span className="evoluir-ex">12 / 12 / 12 / 12</span>
              <p style={{ marginTop: '12px' }}>
                Ao atingir o topo da faixa com boa técnica e ainda sentir que teria 1–2 repetições de sobra, aumente um pouco a carga. Depois disso é normal voltar para 8–10 repetições.
              </p>
              <p className="quote">"Não precisa ficar mais fácil. Você está ficando mais forte."</p>
            </div>
          </div>

          {/* NOTA DE SEGURANÇA */}
          <p className="safety-note">
            Priorize sempre a execução correta. Interrompa o exercício em caso de dor aguda, tontura ou mal-estar.
          </p>

          {/* RODAPÉ */}
          <div className="footer-links" style={{ gap: '16px' }}>
            <button onClick={() => setShowShareModal(true)}>
              Compartilhar Ficha
            </button>
            <span style={{ opacity: 0.3 }}>•</span>
            <button onClick={() => setShowResetConfirm(true)}>
              Reiniciar semana
            </button>
          </div>
        </div>
      ) : (
        /* WORKOUT VIEW */
        <div className="view">
          {/* HEADER */}
          <div className="wo-header">
            <button className="back-btn" onClick={goToHome} aria-label="Voltar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="wo-header-text">
              <p className="wo-header-title">{currentWorkout.label}</p>
              <p className="wo-header-sub">{currentWorkout.focus} · {currentWorkout.sub}</p>
            </div>
            {/* Share button in workout header */}
            <button
              className="back-btn"
              onClick={() => setShowShareModal(true)}
              title="Compartilhar ficha com o aluno"
              aria-label="Compartilhar"
              style={{ marginLeft: 'auto' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          {/* DAY SWITCHER TABS */}
          <div className="wo-day-nav">
            {DAY_ORDER.map((k) => {
              const prog = getDayProgress(k);
              const isDone = prog.done === prog.total && prog.total > 0;
              const isToday = k === todayKey;
              const isActive = k === selectedDay;
              let cls = "day-pill";
              if (isToday) cls += " is-today";
              if (isDone) cls += " is-done";
              if (isActive) cls += " is-active";

              return (
                <button
                  key={k}
                  className={cls}
                  onClick={() => setSelectedDay(k)}
                >
                  {DAY_SHORT[k]}
                  <span className="dot">
                    {isDone ? "✓" : isToday ? "●" : "·"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* EXERCISE LIST */}
          <div className="ex-list">
            {currentWorkout.ex.map((e, idx) => {
              const sets = getExerciseSets(e.id, e.sets);
              const isDone = isExerciseDone(e.id, e.sets);
              const currentLoad = state.loads[e.id] || "";

              return (
                <div key={e.id} className={`ex-card ${isDone ? 'done' : ''}`} id={`card-${e.id}`}>
                  <div className="ex-top">
                    <div className="ex-num">{String(idx + 1).padStart(2, "0")}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <p className="ex-name" style={{ margin: 0 }}>{e.name}</p>
                        <button
                          className="ex-action-btn"
                          onClick={() => openSwapExercise(e)}
                          title="Trocar ou editar exercício"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                          </svg>
                          Trocar
                        </button>
                      </div>
                      <div className="ex-meta">
                        <span><b>{e.sets}</b> séries</span>
                        <span><b>{e.reps}</b></span>
                        <span>descanso <b>{e.rest}</b></span>
                      </div>
                    </div>
                    <div className="ex-done-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>

                  <p className="ex-equip">
                    <b>Carga sugerida:</b> {e.equip}
                  </p>

                  <button
                    type="button"
                    className="video-btn"
                    onClick={() => setVideoExercise(e)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    VER EXECUÇÃO
                  </button>

                  {/* CARGA */}
                  {e.load && (
                    <div className="load-row">
                      <label>MINHA CARGA</label>
                      <div className="load-input-wrap">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.5"
                          placeholder="0"
                          value={currentLoad}
                          onChange={(ev) => updateLoad(e.id, ev.target.value)}
                        />
                        <span>kg</span>
                      </div>
                    </div>
                  )}

                  {/* SÉRIES */}
                  <p className="sets-title">SÉRIES</p>
                  <div className="sets-grid">
                    {Array.from({ length: e.sets }).map((_, sIdx) => {
                      const checked = sets[sIdx] || false;
                      return (
                        <button
                          key={sIdx}
                          className={`set-btn ${checked ? 'checked' : ''}`}
                          onClick={() => toggleSet(e.id, sIdx, e.sets)}
                        >
                          <span className="circle">{checked ? "✓" : ""}</span>
                          Série {sIdx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {isDone && (
                    <div className="ex-conclu">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      EXERCÍCIO CONCLUÍDO
                    </div>
                  )}
                </div>
              );
            })}

            {/* ADICIONAR EXERCÍCIO / RESTAURAR */}
            <button
              className="btn-add-exercise"
              onClick={openAddExercise}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar Exercício ao Treino
            </button>

            {isDayCustomized && (
              <button
                className="btn-reset-day"
                onClick={() => handleResetDayWorkout(selectedDay)}
              >
                Restaurar exercícios padrão de {currentWorkout.label.toLowerCase()}
              </button>
            )}
          </div>

          {/* STICKY FINISH BAR */}
          {(() => {
            const prog = getDayProgress(selectedDay);
            const allDone = prog.done === prog.total && prog.total > 0;
            return (
              <div className="wo-finish-bar">
                <button
                  className="btn-primary"
                  onClick={() => handleFinishWorkout(selectedDay)}
                  style={allDone ? {} : { opacity: 0.45 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  FINALIZAR TREINO
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* FINISH MODAL */}
      <FinishModal
        isOpen={showFinishModal}
        onClose={() => {
          setShowFinishModal(false);
          goToHome();
        }}
        exerciseCount={currentWorkout.ex.length}
        totalSets={currentWorkout.ex.reduce((acc, curr) => acc + curr.sets, 0)}
      />

      {/* RESET CONFIRMATION MODAL */}
      <ResetConfirmModal
        isOpen={showResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleResetWeek}
      />

      {/* COVER PHOTO PICKER MODAL */}
      <CoverPhotoPickerModal
        isOpen={showPhotoPicker}
        onClose={() => setShowPhotoPicker(false)}
        currentPhoto={currentCoverPhoto}
        onSelectPhoto={handleSelectCoverPhoto}
      />

      {/* EXERCISE CUSTOMIZATION MODAL */}
      <ExercisePickerModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        targetExercise={editingExercise}
        onSaveExercise={handleSaveExercise}
        onDeleteExercise={handleDeleteExercise}
      />

      {/* STUDENT SHARING MODAL */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        profile={state.profile || {}}
        onUpdateProfile={handleUpdateProfile}
        workoutsMap={activeWorkoutsMap}
        customWorkouts={state.customWorkouts}
        coverPhotoUrl={currentCoverPhoto}
        onImportPayload={handleImportPayload}
      />

      {/* IN-APP VIDEO EXECUTION MODAL */}
      <VideoModal
        isOpen={Boolean(videoExercise)}
        onClose={() => setVideoExercise(null)}
        exercise={videoExercise}
      />
    </div>
  );
}
