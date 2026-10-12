import React, { useState } from 'react';
import { GYM_COVER_PRESETS, DEFAULT_GYM_COVER } from '../data/workouts';

interface CoverPhotoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string;
  onSelectPhoto: (url: string) => void;
}

export const CoverPhotoPickerModal: React.FC<CoverPhotoPickerModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  onSelectPhoto,
}) => {
  const [customUrl, setCustomUrl] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectPhoto(customUrl.trim());
      setCustomUrl('');
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectPhoto(event.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-box" style={{ maxWidth: '420px', textAlign: 'left', padding: '26px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 className="modal-title" style={{ margin: 0, fontSize: '22px' }}>Foto de Capa da Academia</h3>
          <button
            onClick={onClose}
            style={{ fontSize: '20px', color: 'rgba(245,242,235,0.6)', padding: '4px' }}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'rgba(245,242,235,0.7)', margin: '0 0 16px', lineHeight: 1.5 }}>
          Escolha uma das fotos selecionadas de academia ou use sua própria foto:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
          {GYM_COVER_PRESETS.map((preset) => {
            const isSelected = currentPhoto === preset.url;
            return (
              <button
                key={preset.url}
                onClick={() => {
                  onSelectPhoto(preset.url);
                  onClose();
                }}
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-gold)',
                  boxShadow: isSelected ? '0 0 14px rgba(200,153,88,0.5)' : 'none',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.4)',
                }}
              >
                <img
                  src={preset.url || DEFAULT_GYM_COVER}
                  alt={preset.name}
                  style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.dataset.fallbackApplied) {
                      img.dataset.fallbackApplied = 'true';
                      img.src = DEFAULT_GYM_COVER;
                    }
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    padding: '6px 4px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: isSelected ? 'var(--gold-light)' : 'rgba(245,242,235,0.85)',
                    background: 'rgba(15,18,22,0.92)',
                  }}
                >
                  {isSelected ? '✓ ' : ''}{preset.name}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--gold-primary)', letterSpacing: '0.08em', marginBottom: '6px' }}>
            OU FAÇA UPLOAD DE UMA FOTO
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '12px',
              border: '1px dashed rgba(200,153,88,0.4)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--gold-light)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>📁 Escolher arquivo do aparelho</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="url"
            placeholder="Ou cole a URL da imagem..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '11px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(200,153,88,0.3)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 14px',
              borderRadius: '11px',
              background: 'linear-gradient(100deg, var(--gold-dark), var(--gold-primary))',
              color: '#0F1216',
              fontSize: '12.5px',
              fontWeight: 800,
            }}
          >
            Salvar
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={() => {
              onSelectPhoto(DEFAULT_GYM_COVER);
              onClose();
            }}
            style={{ fontSize: '12px', color: 'rgba(245,242,235,0.5)', textDecoration: 'underline' }}
          >
            Restaurar capa padrão
          </button>
        </div>
      </div>
    </div>
  );
};
