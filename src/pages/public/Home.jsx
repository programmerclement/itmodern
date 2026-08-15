import { ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import { APP_NAME, COMPANY_SLOGAN, LOGO_URL } from '../../constants/config.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useProducts } from '../../hooks/useProducts.js';
import { useHeroSlides } from '../../hooks/useHeroSlides.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';
import Button from '../../components/common/Button.jsx';
import CategoryCard from '../../components/product/CategoryCard.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';
import HeroCarousel from '../../components/home/HeroCarousel.jsx';
import WhatsAppIcon from '../../components/common/WhatsAppIcon.jsx';
import { cn } from '../../utils/cn.js';

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

  const generalWhatsAppLink = buildWhatsAppLink(
    `Hello, I'd like to know more about your products at ${APP_NAME}.`
  );
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
            {generalWhatsAppLink && (
              <Button
                href={generalWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                leftIcon={<WhatsAppIcon className="h-4 w-4 text-[#25D366]" />}
              >
                Chat on WhatsApp
              </Button>
            )}
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
