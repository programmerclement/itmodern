import { ShieldCheck, Truck, BadgeCheck, Mail, MapPin, Phone } from 'lucide-react';
import { APP_NAME, COMPANY_SLOGAN, LOGO_URL } from '../../constants/config.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useProducts } from '../../hooks/useProducts.js';
import { useHeroSlides } from '../../hooks/useHeroSlides.js';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import Button from '../../components/common/Button.jsx';
import CategoryCard from '../../components/product/CategoryCard.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';
import HeroCarousel from '../../components/home/HeroCarousel.jsx';
import WhatsAppIcon from '../../components/common/WhatsAppIcon.jsx';
import WhatsAppButton from '../../components/common/WhatsAppButton.jsx';
import { cn } from '../../utils/cn.js';

const MAP_ADDRESS = '54 KN 59 St, Kigali';
const MAP_DIRECTIONS_URL = 'https://maps.app.goo.gl/ikH6CbPr96qBrVDC6';
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_ADDRESS)}&output=embed`;

const TRUST_INDICATORS = [
  { icon: BadgeCheck, label: 'Genuine products', description: 'New, refurbished & used — always clearly labeled' },
  { icon: ShieldCheck, label: 'Warranty included', description: 'Every device backed by a warranty period' },
  { icon: Truck, label: 'Delivery across Rwanda', description: 'Pickup or delivery, your choice' },
  { icon: WhatsAppIcon, label: 'WhatsApp support', description: 'Real answers from a real person' },
];

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featuredData, isLoading: featuredLoading } = useProducts({ featured: 'true', limit: 8 });
  const { data: heroSlides } = useHeroSlides();
  const { data: settings } = useSiteSettings();

  const hasHeroSlides = heroSlides?.length > 0;

  return (
    <div>
      <section
        className={cn(
          'relative overflow-hidden',
          hasHeroSlides ? 'min-h-[420px] sm:min-h-[480px]' : 'bg-slate-50 dark:bg-slate-900'
        )}
      >
        {hasHeroSlides && (
          <>
            <HeroCarousel slides={heroSlides} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/50 to-slate-950/40" />
          </>
        )}

        <div className="relative mx-auto flex min-h-[inherit] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <img src={LOGO_URL} alt={APP_NAME} className="mx-auto mb-6 h-20 w-20 object-contain" />
          <h1
            className={cn(
              'text-4xl font-semibold tracking-tight sm:text-5xl',
              hasHeroSlides ? 'text-white drop-shadow-sm' : 'text-slate-900 dark:text-slate-100'
            )}
          >
            Computers &amp; electronics you can trust
          </h1>
          <p
            className={cn(
              'mt-2 text-sm font-medium uppercase tracking-wide',
              hasHeroSlides ? 'text-brand-300' : 'text-brand-600 dark:text-brand-400'
            )}
          >
            {COMPANY_SLOGAN}
          </p>
          <p
            className={cn(
              'mx-auto mt-4 max-w-xl text-lg',
              hasHeroSlides ? 'text-slate-100' : 'text-slate-600 dark:text-slate-300'
            )}
          >
            New, refurbished, and used laptops, desktops, and accessories — honestly graded, warrantied,
            and ready to ship across Rwanda.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/shop" size="lg">
              Shop now
            </Button>
            <WhatsAppButton
              message={`Hello, I'd like to know more about your products at ${APP_NAME}.`}
              variant="outline"
              size="lg"
              leftIcon={<WhatsAppIcon className="h-4 w-4 text-[#25D366]" />}
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Shop by category</h2>
        {categoriesLoading ? (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {categories?.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>

      {(featuredLoading || featuredData?.products?.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Featured products</h2>
            <Button to="/shop" variant="link">
              View all
            </Button>
          </div>
          <ProductGrid products={featuredData?.products} isLoading={featuredLoading} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Visit or reach us</h2>
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-5 bg-slate-50 p-8 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Have questions or want to see a device in person? Here&apos;s how to find us.
            </p>
            <div className="space-y-4">
              {settings?.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 transition-colors hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/15">
                    <Phone className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </span>
                  {settings.contactPhone}
                </a>
              )}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 transition-colors hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/15">
                    <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </span>
                  {settings.contactEmail}
                </a>
              )}
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm font-medium text-slate-700 transition-colors hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/15">
                  <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </span>
                {settings?.contactAddress || MAP_ADDRESS}
              </a>
            </div>
            <Button
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="w-fit"
            >
              Get directions
            </Button>
          </div>

          <iframe
            title={`${APP_NAME} location`}
            src={MAP_EMBED_SRC}
            className="h-72 w-full border-0 lg:h-full lg:min-h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST_INDICATORS.map(({ icon: Icon, label, description }) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/15">
                <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
