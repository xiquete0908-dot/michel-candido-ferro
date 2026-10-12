import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { StudentProfile, WorkoutDay, ShareableWorkoutPayload } from '../types';
import {
  buildShareUrl,
  formatWhatsAppMessage,
  formatWorkoutTextSummary,
  decodeSharePayload,
} from '../utils/sharing';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  workoutsMap: Record<string, WorkoutDay>;
  customWorkouts?: Record<string, WorkoutDay>;
  coverPhotoUrl: string;
  onImportPayload: (payload: ShareableWorkoutPayload) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  workoutsMap,
  customWorkouts,
  coverPhotoUrl,
  onImportPayload,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'import'>('share');
  const [studentName, setStudentName] = useState(profile.studentName || '');
  const [trainerName, setTrainerName] = useState(profile.trainerName || '');
  const [goal, setGoal] = useState(profile.goal || '');
  const [notes, setNotes] = useState(profile.notes || '');

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('');
  const [importInput, setImportInput] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  // Sync profile when opened
  useEffect(() => {
    if (isOpen) {
      setStudentName(profile.studentName || '');
      setTrainerName(profile.trainerName || '');
      setGoal(profile.goal || '');
      setNotes(profile.notes || '');
      setCopyFeedback('');
      setImportError('');
      setActiveTab('share');
    }
  }, [isOpen, profile]);

  // Current profile object
  const currentProfile: StudentProfile = {
    studentName: studentName.trim(),
    trainerName: trainerName.trim(),
    goal: goal.trim(),
    notes: notes.trim(),
  };

  // Build current payload: only send custom workouts if they actually exist!
  const currentPayload: ShareableWorkoutPayload = {
    version: 1,
    profile: currentProfile,
    customWorkouts: customWorkouts && Object.keys(customWorkouts).length > 0 ? customWorkouts : undefined,
    coverPhotoUrl,
    timestamp: Date.now(),
  };

  const shareUrl = buildShareUrl(currentPayload);

  // Generate QR code safely when payload or URL changes
  useEffect(() => {
    if (!isOpen || activeTab !== 'share') return;

    // Use full shareUrl if under 1600 characters, else clean direct link
    const qrTarget =
      shareUrl.length <= 1600
        ? shareUrl
        : `${window.location.origin}${window.location.pathname}#aluno=${encodeURIComponent(studentName.trim())}`;

    QRCode.toDataURL(qrTarget, {
      width: 220,
      margin: 1.5,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#0F1216',
        light: '#E8CCA4',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => {
        console.warn('QR Code generation with full payload exceeded limit, falling back to app link', err);
        // Fallback to base application URL
        const fallbackUrl = `${window.location.origin}${window.location.pathname}`;
        QRCode.toDataURL(fallbackUrl, {
          width: 220,
          margin: 1.5,
          errorCorrectionLevel: 'L',
          color: {
            dark: '#0F1216',
            light: '#E8CCA4',
          },
        })
          .then((fallbackDataUrl) => setQrCodeDataUrl(fallbackDataUrl))
          .catch((finalErr) => console.error('Final QR fallback error', finalErr));
      });
  }, [isOpen, shareUrl, activeTab, studentName]);

  const handleProfileChange = () => {
    onUpdateProfile(currentProfile);
  };

  const handleCopyLink = async () => {
    handleProfileChange();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback('Link copiado com sucesso! Pode enviar ao aluno.');
      setTimeout(() => setCopyFeedback(''), 4000);
    } catch {
      setCopyFeedback('Selecione e copie o link no campo abaixo.');
    }
  };

  const handleSendWhatsApp = () => {
    handleProfileChange();
    const msg = formatWhatsAppMessage(currentProfile, workoutsMap, shareUrl);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyTextSummary = async () => {
    handleProfileChange();
    const summary = formatWorkoutTextSummary(currentProfile, workoutsMap);
    try {
      await navigator.clipboard.writeText(summary);
      setCopyFeedback('Ficha em texto copiada! Você pode colar no WhatsApp ou imprimir.');
      setTimeout(() => setCopyFeedback(''), 4000);
    } catch {
      setCopyFeedback('Falha ao copiar.');
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');

    const raw = importInput.trim();
    if (!raw) return;

    let payload: ShareableWorkoutPayload | null = null;

    // Check if it's a link with hash #treino=...
    if (raw.includes('#treino=')) {
      const parts = raw.split('#treino=');
      if (parts[1]) {
        payload = decodeSharePayload(parts[1]);
      }
    } else if (raw.startsWith('{')) {
      // Direct JSON
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = null;
      }
    } else {
      // Direct base64 token
      payload = decodeSharePayload(raw);
    }

    if (payload) {
      onImportPayload(payload);
      onClose();
    } else {
      setImportError('Código ou link de treino inválido. Verifique e tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open">
      <div
        className="modal-box"
        style={{
          maxWidth: '480px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          padding: '24px 20px',
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
            <h3 className="modal-title" style={{ margin: 0, fontSize: '21px' }}>
              Compartilhar com Alunos
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--gold-light)' }}>
              Envie a ficha completa com vídeos e registros para o celular do seu aluno
            </p>
          </div>
          <button
            onClick={() => {
              handleProfileChange();
              onClose();
            }}
            style={{ fontSize: '20px', color: 'rgba(245,242,235,0.6)', padding: '4px' }}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '16px',
            background: 'rgba(0,0,0,0.3)',
            padding: '4px',
            borderRadius: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('share')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '9px',
              fontSize: '12.5px',
              fontWeight: 700,
              background:
                activeTab === 'share'
                  ? 'linear-gradient(100deg, #A87738, #C89958)'
                  : 'transparent',
              color: activeTab === 'share' ? '#0F1216' : 'rgba(245,242,235,0.7)',
              transition: 'all .2s ease',
            }}
          >
            📤 Enviar para Aluno
          </button>
          <button
            onClick={() => setActiveTab('import')}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '9px',
              fontSize: '12.5px',
              fontWeight: 700,
              background:
                activeTab === 'import'
                  ? 'linear-gradient(100deg, #A87738, #C89958)'
                  : 'transparent',
              color: activeTab === 'import' ? '#0F1216' : 'rgba(245,242,235,0.7)',
              transition: 'all .2s ease',
            }}
          >
            📥 Importar Ficha
          </button>
        </div>

        {activeTab === 'share' ? (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Student Info Inputs */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-gold)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--gold-primary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                1. Personalização do Aluno(a)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--marble-cream)', marginBottom: '4px' }}>
                    Nome do Aluno(a)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Beatriz Silva"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '9px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(200,153,88,0.3)',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--marble-cream)', marginBottom: '4px' }}>
                    Professor / Personal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Prof. Ricardo"
                    value={trainerName}
                    onChange={(e) => setTrainerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '9px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(200,153,88,0.3)',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--marble-cream)', marginBottom: '4px' }}>
                  Objetivo Principal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Hipertrofia e definição muscular"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '9px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(200,153,88,0.3)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--marble-cream)', marginBottom: '4px' }}>
                  Orientações do Treino (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Descansar 90s nas séries pesadas, foco na cadência."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '9px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(200,153,88,0.3)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Quick Actions (WhatsApp & Copy) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleSendWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: '#25D366',
                  color: '#0F1216',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -6px rgba(37,211,102,0.5)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 2c-5.508 0-9.986 4.471-9.986 9.974 0 1.764.46 3.486 1.332 5.006l-1.377 5.02 5.154-1.348c1.472.802 3.125 1.226 4.877 1.226 5.508 0 9.986-4.471 9.986-9.974 0-5.503-4.478-9.974-9.986-9.974zm5.827 14.157c-.244.686-1.42 1.309-1.956 1.353-.513.042-1.183.187-3.876-.87-3.238-1.27-5.326-4.564-5.488-4.78-.162-.216-1.308-1.741-1.308-3.321 0-1.58.829-2.358 1.123-2.678.293-.321.639-.401.852-.401.213 0 .426.002.612.012.197.01.46-.075.719.547.269.645.918 2.241.998 2.404.08.163.133.355.027.571-.107.217-.16.353-.319.541-.16.188-.337.42-.48.563-.16.16-.328.334-.141.654.187.32 1.053 1.737 2.26 2.812 1.554 1.385 2.863 1.815 3.268 2.017.406.202.645.174.884-.103.24-.277 1.026-1.196 1.302-1.606.277-.411.553-.343.931-.202.379.141 2.399 1.131 2.811 1.337.412.206.686.309.787.48.102.172.102.998-.142 1.684z" />
                </svg>
                Compartilhar no WhatsApp do Aluno
              </button>

              <button
                onClick={handleCopyLink}
                className="btn-primary"
                style={{ padding: '13px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Copiar Link Exclusivo do Treino
              </button>

              <button
                onClick={handleCopyTextSummary}
                className="btn-ghost"
                style={{ padding: '11px', fontSize: '13px' }}
              >
                📋 Copiar Ficha em Texto Completo
              </button>

              {copyFeedback && (
                <div
                  style={{
                    background: 'rgba(200, 153, 88, 0.15)',
                    border: '1px solid var(--gold-primary)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'var(--gold-light)',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {copyFeedback}
                </div>
              )}
            </div>

            {/* QR Code Section */}
            {qrCodeDataUrl && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--gold-primary)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  2. QR Code para o Aluno Escanear
                </span>
                <p style={{ fontSize: '12px', color: 'rgba(245,242,235,0.65)', margin: '0 0 12px' }}>
                  Mostre na academia para o aluno apontar a câmera do celular:
                </p>
                <div
                  style={{
                    background: '#E8CCA4',
                    padding: '10px',
                    borderRadius: '14px',
                    display: 'inline-block',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src={qrCodeDataUrl || undefined}
                    alt="QR Code do Treino"
                    style={{ width: '180px', height: '180px', display: 'block' }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Import Tab */
          <form
            onSubmit={handleImportSubmit}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <p style={{ fontSize: '13px', color: 'rgba(245,242,235,0.7)', margin: 0, lineHeight: 1.5 }}>
              Cole abaixo o link do treino compartilhado pelo seu professor, ou o código/JSON para carregar a ficha completa:
            </p>

            <textarea
              rows={6}
              placeholder="Cole aqui o link ou código do treino (ex: https://...#treino=...)..."
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-gold)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'monospace',
              }}
            />

            {importError && (
              <div
                style={{
                  background: 'rgba(220, 50, 50, 0.15)',
                  border: '1px solid rgba(220, 50, 50, 0.4)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#ff9999',
                }}
              >
                {importError}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '14px', marginTop: 'auto' }}
            >
              📥 Importar e Carregar Ficha
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
