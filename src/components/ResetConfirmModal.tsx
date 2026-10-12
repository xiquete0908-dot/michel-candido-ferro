import React from 'react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className={`confirm-overlay ${isOpen ? 'open' : ''}`}>
      <div className="confirm-box">
        <p>
          Tem certeza que deseja iniciar uma nova semana?
          <br />
          <span style={{ opacity: 0.6, fontSize: '13px' }}>
            As cargas registradas serão mantidas.
          </span>
        </p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-ok" onClick={onConfirm}>
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};
