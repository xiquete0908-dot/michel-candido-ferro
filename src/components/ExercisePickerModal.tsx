import React, { useState, useMemo } from 'react';
import { Exercise, CatalogExercise } from '../types';
import { POPULAR_EXERCISES_CATALOG, EXERCISE_CATEGORIES } from '../data/exerciseCatalog';
import { VideoModal } from './VideoModal';

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetExercise?: Exercise | null; // null if adding new exercise
  onSaveExercise: (exercise: Exercise, isNew: boolean) => void;
  onDeleteExercise?: (exerciseId: string) => void;
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  isOpen,
  onClose,
  targetExercise,
  onSaveExercise,
  onDeleteExercise,
}) => {
  const [tab, setTab] = useState<'catalog' | 'manual'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  // Manual form state
  const [manualName, setManualName] = useState('');
  const [manualSets, setManualSets] = useState(4);
  const [manualReps, setManualReps] = useState('8–12');
  const [manualRest, setManualRest] = useState('60–90s');
  const [manualEquip, setManualEquip] = useState('');
  const [manualVideo, setManualVideo] = useState('');
  const [manualLoad, setManualLoad] = useState(true);

  // Initialize manual form when modal opens or target changes
  React.useEffect(() => {
    if (targetExercise) {
      setManualName(targetExercise.name);
      setManualSets(targetExercise.sets);
      setManualReps(targetExercise.reps);
      setManualRest(targetExercise.rest);
      setManualEquip(targetExercise.equip);
      setManualVideo(targetExercise.video);
      setManualLoad(targetExercise.load);
    } else {
      setManualName('');
      setManualSets(4);
      setManualReps('8–12');
      setManualRest('60–90s');
      setManualEquip('Halteres ou máquina.');
      setManualVideo('');
      setManualLoad(true);
    }
    setTab('catalog');
    setSearchQuery('');
  }, [targetExercise, isOpen]);

  // Filtered exercises from the catalog
  const filteredCatalog = useMemo(() => {
    return POPULAR_EXERCISES_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todos' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.equip.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Handle selecting an exercise from the catalog
  const handleSelectFromCatalog = (catItem: CatalogExercise) => {
    const isNew = !targetExercise;
    const newEx: Exercise = {
      id: targetExercise ? targetExercise.id : `ex_${Date.now()}`,
      name: catItem.name,
      sets: catItem.sets,
      reps: catItem.reps,
      rest: catItem.rest,
      equip: catItem.equip,
      video: catItem.video,
      load: catItem.load,
    };
    onSaveExercise(newEx, isNew);
    onClose();
  };

  // Handle manual form submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    // If no video URL provided, automatically generate YouTube search for correct execution
    const autoVideo =
      manualVideo.trim() ||
      `https://www.youtube.com/results?search_query=execucao+correta+${encodeURIComponent(manualName.trim())}`;

    const isNew = !targetExercise;
    const newEx: Exercise = {
      id: targetExercise ? targetExercise.id : `ex_${Date.now()}`,
      name: manualName.trim(),
      sets: Number(manualSets) || 3,
      reps: manualReps.trim() || '8–12',
      rest: manualRest.trim() || '60s',
      equip: manualEquip.trim() || 'Carga adequada.',
      video: autoVideo,
      load: manualLoad,
    };
    onSaveExercise(newEx, isNew);
    onClose();
  };

  return (
    <div className="modal-overlay open">
      <div
        className="modal-box"
        style={{
          maxWidth: '480px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          padding: '22px 18px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            borderBottom: '1px solid var(--border-gold)',
            paddingBottom: '12px',
          }}
        >
          <div>
            <h3
              className="modal-title"
              style={{ margin: 0, fontSize: '20px', lineHeight: 1.2 }}
            >
              {targetExercise ? `Trocar: ${targetExercise.name}` : 'Adicionar Exercício'}
            </h3>
            <p
              style={{
                margin: '3px 0 0',
                fontSize: '12px',
                color: 'var(--gold-light)',
              }}
            >
              Escolha um exercício pronto com vídeo automático ou customize
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: '20px',
              color: 'rgba(245,242,235,0.6)',
              padding: '4px',
            }}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '14px',
            background: 'rgba(0,0,0,0.3)',
            padding: '4px',
            borderRadius: '12px',
          }}
        >
          <button
            onClick={() => setTab('catalog')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '9px',
              fontSize: '12.5px',
              fontWeight: 700,
              background:
                tab === 'catalog'
                  ? 'linear-gradient(100deg, #A87738, #C89958)'
                  : 'transparent',
              color: tab === 'catalog' ? '#0F1216' : 'rgba(245,242,235,0.7)',
              transition: 'all .2s ease',
            }}
          >
            ⭐ Treinos Mais Usados (Catálogo)
          </button>
          <button
            onClick={() => setTab('manual')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '9px',
              fontSize: '12.5px',
              fontWeight: 700,
              background:
                tab === 'manual'
                  ? 'linear-gradient(100deg, #A87738, #C89958)'
                  : 'transparent',
              color: tab === 'manual' ? '#0F1216' : 'rgba(245,242,235,0.7)',
              transition: 'all .2s ease',
            }}
          >
            ✏️ Criar / Editar Manual
          </button>
        </div>

        {tab === 'catalog' ? (
          <>
            {/* Search Input */}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar exercício (ex: Leg Press, Supino, Cadeira...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '11px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginBottom: '10px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {EXERCISE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      flexShrink: 0,
                      padding: '5px 11px',
                      borderRadius: '16px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      background: isSelected
                        ? 'var(--gold-primary)'
                        : 'rgba(255,255,255,0.05)',
                      color: isSelected ? '#0F1216' : 'rgba(245,242,235,0.65)',
                      border: isSelected
                        ? '1px solid var(--gold-light)'
                        : '1px solid rgba(200,153,88,0.2)',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Catalog List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingRight: '4px',
              }}
            >
              {filteredCatalog.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '26px 10px',
                    color: 'rgba(245,242,235,0.5)',
                    fontSize: '13px',
                  }}
                >
                  Nenhum exercício encontrado para "{searchQuery}".
                  <br />
                  <button
                    onClick={() => setTab('manual')}
                    style={{
                      marginTop: '8px',
                      color: 'var(--gold-light)',
                      textDecoration: 'underline',
                      fontWeight: 600,
                    }}
                  >
                    Cadastrar manualmente
                  </button>
                </div>
              ) : (
                filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'border-color .2s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '8px',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '10px',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: 'var(--gold-primary)',
                            marginBottom: '2px',
                          }}
                        >
                          {item.category}
                        </span>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: 'var(--marble-cream)',
                          }}
                        >
                          {item.name}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectFromCatalog(item)}
                        style={{
                          background:
                            'linear-gradient(100deg, #A87738, #C89958)',
                          color: '#0F1216',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 800,
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      >
                        Selecionar ✓
                      </button>
                    </div>

                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'rgba(245,242,235,0.6)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <span>
                        <b>{item.sets}</b> séries
                      </span>
                      <span>
                        <b>{item.reps}</b> reps
                      </span>
                      <span>
                        descanso <b>{item.rest}</b>
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'rgba(245,242,235,0.5)',
                        lineHeight: 1.4,
                      }}
                    >
                      <b>Sugestão:</b> {item.equip}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--gold-light)',
                          fontWeight: 600,
                        }}
                      >
                        ▶ Vídeo de execução configurado
                      </span>
                      <button
                        type="button"
                        style={{
                          fontSize: '11px',
                          color: 'var(--gold-light)',
                          textDecoration: 'underline',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewExercise({
                            id: item.id,
                            name: item.name,
                            sets: item.sets,
                            reps: item.reps,
                            rest: item.rest,
                            equip: item.equip,
                            video: item.video,
                            load: item.load,
                          });
                        }}
                      >
                        Testar vídeo
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Manual Form */
          <form
            onSubmit={handleManualSubmit}
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingRight: '4px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--gold-primary)',
                  marginBottom: '5px',
                  letterSpacing: '0.04em',
                }}
              >
                NOME DO EXERCÍCIO *
              </label>
              <input
                type="text"
                placeholder="Ex: Cadeira Flexora, Tríceps Testa..."
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    marginBottom: '5px',
                  }}
                >
                  SÉRIES
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={manualSets}
                  onChange={(e) => setManualSets(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    marginBottom: '5px',
                  }}
                >
                  REPETIÇÕES
                </label>
                <input
                  type="text"
                  placeholder="Ex: 8–12, 10–15"
                  value={manualReps}
                  onChange={(e) => setManualReps(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                    marginBottom: '5px',
                  }}
                >
                  DESCANSO
                </label>
                <input
                  type="text"
                  placeholder="Ex: 60–90s"
                  value={manualRest}
                  onChange={(e) => setManualRest(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--marble-cream)',
                    cursor: 'pointer',
                    marginTop: '16px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={manualLoad}
                    onChange={(e) => setManualLoad(e.target.checked)}
                    style={{ accentColor: 'var(--gold-primary)', width: '16px', height: '16px' }}
                  />
                  Registrar Carga (kg)
                </label>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--gold-primary)',
                  marginBottom: '5px',
                }}
              >
                APARELHO / CARGA SUGERIDA
              </label>
              <input
                type="text"
                placeholder="Ex: Máquina com ajuste firme, halteres..."
                value={manualEquip}
                onChange={(e) => setManualEquip(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}
              >
                <label
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--gold-primary)',
                  }}
                >
                  LINK DO VÍDEO DE EXECUÇÃO
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (manualName.trim()) {
                      setManualVideo(
                        `https://www.youtube.com/results?search_query=execucao+correta+${encodeURIComponent(manualName.trim())}`
                      );
                    }
                  }}
                  style={{
                    fontSize: '11px',
                    color: 'var(--gold-light)',
                    textDecoration: 'underline',
                  }}
                >
                  Gerar busca no YouTube
                </button>
              </div>
              <input
                type="url"
                placeholder="https://youtube.com/shorts/... ou deixe em branco para busca direta"
                value={manualVideo}
                onChange={(e) => setManualVideo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: 'rgba(245,242,235,0.45)',
                  marginTop: '3px',
                  display: 'block',
                }}
              >
                Se deixar em branco, o botão "VER EXECUÇÃO" buscará automaticamente o vídeo exato no YouTube.
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-gold)',
              }}
            >
              {targetExercise && onDeleteExercise && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteExercise(targetExercise.id);
                    onClose();
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(180, 50, 50, 0.2)',
                    border: '1px solid rgba(220, 60, 60, 0.4)',
                    color: '#ff9b9b',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  Excluir
                </button>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, padding: '12px 16px' }}
              >
                Salvar Exercício ✓
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Video preview modal */}
      <VideoModal
        isOpen={Boolean(previewExercise)}
        onClose={() => setPreviewExercise(null)}
        exercise={previewExercise}
      />
    </div>
  );
};
