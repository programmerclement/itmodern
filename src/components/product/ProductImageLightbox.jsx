import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ProductImageLightbox({ images, activeIndex, productName, onClose, onNavigate }) {
  const touchStartX = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onNavigate(activeIndex - 1);
      if (event.key === 'ArrowRight') onNavigate(activeIndex + 1);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, onNavigate]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      onNavigate(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  const active = images[activeIndex];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product image, full screen"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 animate-fade-in"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close full screen view"
        className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate(activeIndex - 1);
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:left-4"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate(activeIndex + 1);
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:right-4"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <img
        src={active.url}
        alt={productName}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] select-none object-contain"
      />

      {images.length > 1 && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white">
          {activeIndex + 1} / {images.length}
        </span>
      )}
    </div>,
    document.body
  );
}
