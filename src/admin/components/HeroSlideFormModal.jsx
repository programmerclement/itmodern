import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as uploadService from '../../services/uploadService.js';

const EMPTY_FORM = { imageUrl: '', publicId: '', title: '', linkUrl: '', isActive: true };

export default function HeroSlideFormModal({ isOpen, onClose, slide, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setForm(
        slide
          ? {
              imageUrl: slide.imageUrl,
              publicId: slide.publicId ?? '',
              title: slide.title ?? '',
              linkUrl: slide.linkUrl ?? '',
              isActive: slide.isActive,
            }
          : EMPTY_FORM
      );
    }
  }, [isOpen, slide]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadService.uploadImage(file, 'itmodern/hero');
      update({ imageUrl: result.data.url, publicId: result.data.publicId });
    } catch (err) {
      toast.error('Image upload failed', err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.imageUrl) {
      toast.error('Upload a slide image first');
      return;
    }
    await onSubmit({ ...form, publicId: form.publicId || undefined, linkUrl: form.linkUrl || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={slide ? 'Edit slide' : 'Add slide'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Slide image</p>
          {form.imageUrl ? (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-slate-200">
              <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => update({ imageUrl: '', publicId: '' })}
                aria-label="Remove image"
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-700 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex aspect-[21/9] w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-slate-400 hover:border-brand-400 hover:text-brand-500"
            >
              {isUploading ? <Loader size="sm" /> : <Upload className="h-5 w-5" />}
              <span className="text-xs">{isUploading ? 'Uploading...' : 'Upload image (recommended 21:9)'}</span>
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </div>

        <Input
          label="Title"
          placeholder="Optional caption shown on the slide"
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
        />
        <Input
          label="Link"
          placeholder="e.g. /shop/laptops or a full URL — optional"
          value={form.linkUrl}
          onChange={(e) => update({ linkUrl: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update({ isActive: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Active (visible on the home page)
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isUploading}>
            Save slide
          </Button>
        </div>
      </form>
    </Modal>
  );
}
