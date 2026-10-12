import React from 'react';
import { ConfettiCanvas } from './ConfettiCanvas';

interface FinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseCount: number;
  totalSets: number;
}

export const FinishModal: React.FC<FinishModalProps> = ({
  isOpen,
  onClose,
  exerciseCount,
  totalSets,
}) => {
  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-box">
        <ConfettiCanvas active={isOpen} />
        <div className="modal-title">✨ Treino concluído ✨</div>
        <div className="modal-quote">A sua melhor versão é esculpida no silêncio de cada repetição.</div>
        <div className="modal-stats">
          <div className="modal-stat">
            <div className="num">{exerciseCount}</div>
            <div className="lbl">EXERCÍCIOS</div>
          </div>
          <div className="modal-stat">
            <div className="num">{totalSets}</div>
            <div className="lbl">SÉRIES</div>
          </div>
        </div>
        <button className="btn-primary" onClick={onClose} style={{ marginBottom: 0 }}>
          VOLTAR AO INÍCIO
        </button>
      </div>
    </div>
  );
};
