import { useRef, useState } from 'react';
import { Star, Trash2, Upload } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as uploadService from '../../services/uploadService.js';
import { cn } from '../../utils/cn.js';

export default function ImageUploader({ images = [], onChange }) {
  const inputRef = useRef(null);
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadService.uploadImage(file);
      const newImage = {
        url: result.data.url,
        publicId: result.data.publicId,
        isMain: images.length === 0,
      };
      onChange([...images, newImage]);
    } catch (err) {
      toast.error('Image upload failed', err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index) => {
    const next = images.filter((_, i) => i !== index);
    if (images[index].isMain && next.length > 0) {
      next[0] = { ...next[0], isMain: true };
    }
    onChange(next);
  };

  const handleSetMain = (index) => {
    onChange(images.map((img, i) => ({ ...img, isMain: i === index })));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={image.publicId ?? image.url}
            className="group relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200"
          >
            <img src={image.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-slate-900/0 opacity-0 transition-opacity group-hover:bg-slate-900/40 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => handleSetMain(index)}
                aria-label="Set as main image"
                className="rounded-full bg-white p-1.5 text-slate-700 hover:text-amber-500"
              >
                <Star className={cn('h-3.5 w-3.5', image.isMain && 'fill-amber-400 text-amber-400')} />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label="Remove image"
                className="rounded-full bg-white p-1.5 text-slate-700 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {image.isMain && (
              <span className="absolute left-1 top-1 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-medium text-white">
                Main
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-brand-400 hover:text-brand-500"
        >
          {isUploading ? <Loader size="sm" /> : <Upload className="h-5 w-5" />}
          <span className="text-[10px]">{isUploading ? 'Uploading' : 'Add image'}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}
