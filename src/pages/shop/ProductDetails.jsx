import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, PackageCheck, PackageX, ShoppingCart } from 'lucide-react';
import ProductGallery from '../../components/product/ProductGallery.jsx';
import ConditionBadge from '../../components/product/ConditionBadge.jsx';
import PriceTag from '../../components/product/PriceTag.jsx';
import SpecsTable from '../../components/product/SpecsTable.jsx';
import RelatedProducts from '../../components/product/RelatedProducts.jsx';
import ReviewsSection from '../../components/product/ReviewsSection.jsx';
import WishlistButton from '../../components/product/WishlistButton.jsx';
import ShareButton from '../../components/product/ShareButton.jsx';
import WhatsAppIcon from '../../components/common/WhatsAppIcon.jsx';
import QuantitySelector from '../../components/cart/QuantitySelector.jsx';
import Button from '../../components/common/Button.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { useProduct } from '../../hooks/useProducts.js';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { buildProductInquiryLink } from '../../utils/whatsapp.js';
import { APP_NAME } from '../../constants/config.js';

function formatWarranty(warranty) {
  if (!warranty?.duration || !warranty?.unit) return null;
  return `${warranty.duration} ${warranty.unit} warranty`;
}

export default function ProductDetails() {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useProduct(slug);
  const { addItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const product = data?.product;

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ${APP_NAME}`;
    }
    return () => {
      document.title = APP_NAME;
    };
  }, [product]);

  useEffect(() => {
    setQuantity(1);
  }, [slug]);

  if (isLoading) {
    return <PageLoader label="Loading product" />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Product not found"
        description="This product may have been removed or is no longer available."
        onRetry={refetch}
      />
    );
  }

  const whatsappLink = buildProductInquiryLink(product);
  const warrantyLabel = formatWarranty(product.warranty);
  const productId = product.id ?? product._id;
  const outOfStock = product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(product, quantity);
      toast.success('Added to cart', `${quantity} × ${product.name}`);
    } catch (err) {
      toast.error('Could not add to cart', err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      await addItem(product, quantity);
      navigate('/cart');
    } catch (err) {
      toast.error('Could not add to cart', err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} categorySlug={product.category?.slug} />

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              {product.brand?.name && (
                <span className="text-sm font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {product.brand.name}
                </span>
              )}
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{product.name}</h1>
            </div>
            <ShareButton
              title={product.name}
              text={`Check out ${product.name} on ${APP_NAME}`}
              className="static shrink-0 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="mt-3 flex items-center gap-3">
            <ConditionBadge condition={product.condition} conditionGrade={product.conditionGrade} />
            {product.stockQuantity > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                <PackageCheck className="h-4 w-4" /> In stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <PackageX className="h-4 w-4" /> Out of stock
              </span>
            )}
          </div>

          <div className="mt-4">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-slate-600 dark:text-slate-300">{product.shortDescription}</p>
          )}

          {warrantyLabel && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" /> {warrantyLabel}
            </p>
          )}

          {!outOfStock && (
            <div className="mt-6 flex items-center gap-3">
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stockQuantity} />
              <WishlistButton
                productId={productId}
                size="md"
                className="static shrink-0 border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              className="flex-1 sm:min-w-[140px]"
              disabled={outOfStock}
              isLoading={isAdding}
              leftIcon={<ShoppingCart className="h-4 w-4" />}
              onClick={handleAddToCart}
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
            {!outOfStock && (
              <Button
                variant="accent"
                className="flex-1 sm:min-w-[140px]"
                isLoading={isAdding}
                onClick={handleBuyNow}
              >
                Buy now
              </Button>
            )}
            {outOfStock && (
              <WishlistButton
                productId={productId}
                size="md"
                className="static shrink-0 border border-slate-200 dark:border-slate-700"
              />
            )}
            {whatsappLink && (
              <Button
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="flex-1 sm:min-w-[140px]"
                leftIcon={<WhatsAppIcon className="h-4 w-4 text-[#25D366]" />}
              >
                Ask on WhatsApp
              </Button>
            )}
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Description</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {product.description}
              </p>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Specifications</h2>
              <SpecsTable specifications={product.specifications} specFields={product.category?.specFields} />
            </div>
          )}

          {product.sku && <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">SKU: {product.sku}</p>}
        </div>
      </div>

      <ReviewsSection product={product} />

      <RelatedProducts products={data?.related} />
    </div>
  );
}
