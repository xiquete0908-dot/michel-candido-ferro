import React, { useRef } from 'react';
import { Exercise } from '../types';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

/**
 * Extracts video ID and returns official embed URL matching the exact user specification
 */
export function getYouTubeEmbedUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  let videoId = '';
  if (rawUrl.indexOf('shorts/') !== -1) {
    videoId = rawUrl.split('shorts/')[1].split('?')[0];
  } else if (rawUrl.indexOf('v=') !== -1) {
    videoId = rawUrl.split('v=')[1].split('&')[0];
  } else if (rawUrl.indexOf('youtu.be/') !== -1) {
    videoId = rawUrl.split('youtu.be/')[1].split('?')[0];
  } else if (rawUrl.indexOf('embed/') !== -1) {
    videoId = rawUrl.split('embed/')[1].split('?')[0];
  }

  return videoId ? 'https://www.youtube.com/embed/' + videoId + '?rel=0&autoplay=1' : '';
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, exercise }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const exName = exercise ? exercise.name : 'Execução do Exercício';
  const rawUrl = exercise ? exercise.video : '';
  const parsedEmbed = isOpen && rawUrl ? getYouTubeEmbedUrl(rawUrl) : '';
  const embedUrl = parsedEmbed || null;
  const searchUrl = exercise
    ? 'https://www.youtube.com/results?search_query=execucao+correta+' + encodeURIComponent(exName)
    : '';

  const handleClose = () => {
    // Interrompe o áudio/reprodução ao fechar utilizando about:blank para evitar src=""
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }
    const iframeEl = document.getElementById('videoIframe') as HTMLIFrameElement | null;
    if (iframeEl) {
      iframeEl.src = 'about:blank';
    }
    const modalEl = document.getElementById('videoModal');
    if (modalEl) {
      modalEl.classList.remove('open');
    }
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="videoModal">
      <div className="modal-box video-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 id="videoModalTitle" style={{ margin: 0, fontSize: '18px', color: 'var(--cream)' }}>
            {exName}
          </h3>
          <button
            id="closeVideoBtn"
            onClick={handleClose}
            style={{ fontSize: '20px', color: 'var(--champagne)', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            ✕
          </button>
        </div>
        <div className="video-responsive">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              id="videoIframe"
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--champagne)',
                fontSize: '13px',
              }}
            >
              Vídeo demonstrativo indisponível
            </div>
          )}
        </div>
        <a
          id="videoSearchFallback"
          href={searchUrl}
          target="_blank"
          rel="noopener"
          className="btn-ghost"
          style={{ marginTop: '12px', fontSize: '12px', display: 'block', textAlign: 'center' }}
        >
          Caso o vídeo não carregue, clique aqui para buscar no YouTube
        </a>
      </div>
    </div>
  );
};
