import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, GalleryHorizontal, Link as LinkIcon } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import HeroSlideFormModal from '../components/HeroSlideFormModal.jsx';
import ContactInfoForm from '../components/ContactInfoForm.jsx';
import PaymentSettingsForm from '../components/PaymentSettingsForm.jsx';
import { useAdminHeroSlides, ADMIN_HERO_SLIDES_KEY } from '../../hooks/useAdminHeroSlides.js';
import { useSiteSettings, SITE_SETTINGS_KEY } from '../../hooks/useSiteSettings.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as heroSlideService from '../../services/heroSlideService.js';
import * as siteSettingsService from '../../services/siteSettingsService.js';

export default function Settings() {
  const { data: slides, isLoading } = useAdminHeroSlides();
  const { data: siteSettings } = useSiteSettings();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADMIN_HERO_SLIDES_KEY });

  const handleContactSubmit = async (payload) => {
    setIsSavingContact(true);
    try {
      await siteSettingsService.updateSiteSettings(payload);
      toast.success('Contact info updated');
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
    } catch (err) {
      toast.error('Could not update contact info', err.message);
    } finally {
      setIsSavingContact(false);
    }
  };

  const handlePaymentSubmit = async (payload) => {
    setIsSavingPayment(true);
    try {
      await siteSettingsService.updateSiteSettings(payload);
      toast.success('Payment settings updated');
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
    } catch (err) {
      toast.error('Could not update payment settings', err.message);
    } finally {
      setIsSavingPayment(false);
    }
  };

  const openAdd = () => {
    setEditingSlide(null);
    setModalOpen(true);
  };

  const openEdit = (slide) => {
    setEditingSlide(slide);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingSlide) {
        await heroSlideService.updateHeroSlide(editingSlide._id, payload);
        toast.success('Slide updated');
      } else {
        await heroSlideService.createHeroSlide(payload);
        toast.success('Slide added');
      }
      invalidate();
      setModalOpen(false);
    } catch (err) {
      toast.error('Could not save slide', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slide) => {
    try {
      await heroSlideService.deleteHeroSlide(slide._id);
      toast.success('Slide removed');
      invalidate();
    } catch (err) {
      toast.error('Could not remove slide', err.message);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const orderedIds = slides.map((slide) => slide._id);
    [orderedIds[index], orderedIds[targetIndex]] = [orderedIds[targetIndex], orderedIds[index]];

    try {
      await heroSlideService.reorderHeroSlides(orderedIds);
      invalidate();
    } catch (err) {
      toast.error('Could not reorder slides', err.message);
    }
  };

  if (isLoading) return <PageLoader label="Loading settings" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage site-wide contact info and the promotional carousel shown on the home page.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact info</CardTitle>
        </CardHeader>
        <CardBody>
          <ContactInfoForm settings={siteSettings} onSubmit={handleContactSubmit} isSubmitting={isSavingContact} />
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardBody>
          <PaymentSettingsForm settings={siteSettings} onSubmit={handlePaymentSubmit} isSubmitting={isSavingPayment} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Home page carousel</CardTitle>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
            Add slide
          </Button>
        </CardHeader>
        <CardBody>
          {slides?.length === 0 ? (
            <EmptyState
              icon={GalleryHorizontal}
              title="No slides yet"
              description="Add at least one image to show the carousel on the home page."
              action={<Button onClick={openAdd}>Add slide</Button>}
            />
          ) : (
            <div className="space-y-3">
              {slides?.map((slide, index) => (
                <div key={slide._id} className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
                  <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-900">
                        {slide.title || 'Untitled slide'}
                      </span>
                      <Badge variant={slide.isActive ? 'success' : 'neutral'}>
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {slide.linkUrl && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                        <LinkIcon className="h-3 w-3 shrink-0" /> {slide.linkUrl}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === slides.length - 1}
                      aria-label="Move down"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(slide)}
                      aria-label="Edit slide"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(slide)}
                      aria-label="Delete slide"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <HeroSlideFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        slide={editingSlide}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
