import { useState } from 'react';
import { ShoppingBag, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartItemRow from '../../components/cart/CartItemRow.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { Card, CardBody } from '../../components/common/Card.jsx';
import PriceTag from '../../components/product/PriceTag.jsx';
import RequestQuotationModal from '../../components/checkout/RequestQuotationModal.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Cart() {
  const { items, savedItems, subtotal, itemCount, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  if (isLoading) {
    return <PageLoader label="Loading your cart" />;
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Browse the shop and add products you're interested in."
        action={<Button to="/shop">Start shopping</Button>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Your Cart {itemCount > 0 && <span className="text-slate-400 dark:text-slate-500">({itemCount})</span>}
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {items.length > 0 ? (
            <Card>
              <CardBody className="divide-y divide-slate-100 p-0 px-4 dark:divide-slate-700">
                {items.map((item) => (
                  <CartItemRow key={item.productId} item={item} />
                ))}
              </CardBody>
            </Card>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">All items saved for later.</p>
          )}

          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Saved for later</h2>
              <Card>
                <CardBody className="divide-y divide-slate-100 p-0 px-4 dark:divide-slate-700">
                  {savedItems.map((item) => (
                    <CartItemRow key={item.productId} item={{ ...item, savedForLater: true }} />
                  ))}
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div>
            <Card>
              <CardBody className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Order summary</h2>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(subtotal)}</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Delivery fee is calculated at checkout based on your delivery method.
                </p>
                <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                  <PriceTag price={subtotal} size="lg" />
                </div>
                <Button className="w-full" onClick={() => navigate('/checkout')}>
                  Proceed to checkout
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    className="w-full"
                    leftIcon={<FileText className="h-4 w-4" />}
                    onClick={() => setIsQuoteModalOpen(true)}
                  >
                    Request a quotation instead
                  </Button>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <RequestQuotationModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} items={items} />
    </div>
  );
}
