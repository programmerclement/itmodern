import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';
import ProductImageLightbox from './ProductImageLightbox.jsx';

export default function ProductGallery({ images = [], productName, categorySlug }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(null);

  if (!images.length) {
    return (
      <ProductImagePlaceholder categorySlug={categorySlug} className="aspect-square w-full rounded-xl" />
    );
  }

  const goTo = (index) => {
    setActiveIndex(((index % images.length) + images.length) % images.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      goTo(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="h-full w-full shrink-0 cursor-zoom-in"
              aria-label={`View image ${index + 1} of ${productName} full screen`}
            >
              <img src={image.url} alt={productName} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-slate-900/60 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3 w-3" /> Full screen
        </span>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(activeIndex - 1);
              }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100 dark:bg-slate-900/80 dark:text-slate-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo(activeIndex + 1);
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100 dark:bg-slate-900/80 dark:text-slate-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2',
                index === activeIndex ? 'border-brand-600' : 'border-transparent'
              )}
            >
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <ProductImageLightbox
          images={images}
          activeIndex={activeIndex}
          productName={productName}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={goTo}
        />
      )}
    </div>
  );
}
