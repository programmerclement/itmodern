import { useState } from 'react';
import { cn } from '../../utils/cn.js';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';

export default function ProductGallery({ images = [], productName, categorySlug }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <ProductImagePlaceholder categorySlug={categorySlug} className="aspect-square w-full rounded-xl" />
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800">
        <img src={active.url} alt={productName} className="h-full w-full object-cover" />
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
    </div>
  );
}
