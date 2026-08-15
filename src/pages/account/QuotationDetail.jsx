import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Truck, Store } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import QuotationStatusBadge from '../../components/account/QuotationStatusBadge.jsx';
import AddressForm from '../../components/checkout/AddressForm.jsx';
import { useQuotation } from '../../hooks/useQuotations.js';
import { useAddresses, ADDRESSES_QUERY_KEY } from '../../hooks/useAddresses.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as quotationService from '../../services/quotationService.js';
import * as addressService from '../../services/addressService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { cn } from '../../utils/cn.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function QuotationDetail() {
  const { quotationNumber } = useParams();
  const { data: quotation, isLoading, isError, refetch } = useQuotation(quotationNumber);
  const { user } = useAuth();
  const { data: addresses } = useAddresses();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name ?? '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? '');
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  if (isLoading) return <PageLoader label="Loading quotation" />;
  if (isError || !quotation) return <ErrorState title="Quotation not found" onRetry={refetch} />;

  const isExpired = quotation.validUntil && new Date() > new Date(quotation.validUntil);

  const handleAddAddress = async (formValue) => {
    setIsSavingAddress(true);
    try {
      const result = await addressService.createAddress(formValue);
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      setSelectedAddressId(result.data.address._id);
      setIsAddressModalOpen(false);
      toast.success('Address saved');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleAccept = async () => {
    if (deliveryMethod === 'DELIVERY' && !selectedAddressId) {
      toast.error('Select a delivery address');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Contact name and phone are required');
      return;
    }

    setIsAccepting(true);
    try {
      const result = await quotationService.acceptQuotation(quotation.quotationNumber, {
        deliveryMethod,
        addressId: deliveryMethod === 'DELIVERY' ? selectedAddressId : undefined,
        paymentMethod: 'CASH_ON_DELIVERY',
        customerName,
        customerPhone,
      });
      toast.success('Quotation accepted', 'Your order has been created.');
      navigate(`/order-confirmation/${result.data.order.orderNumber}`);
    } catch (err) {
      toast.error('Could not accept quotation', err.message);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await quotationService.declineQuotation(quotation.quotationNumber);
      toast.success('Quotation declined');
      refetch();
    } catch (err) {
      toast.error('Could not decline quotation', err.message);
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{quotation.quotationNumber}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Requested on {formatDate(quotation.createdAt)}</p>
        </div>
        <QuotationStatusBadge status={isExpired ? 'EXPIRED' : quotation.status} />
      </div>

      {quotation.status === 'REQUESTED' && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          We&apos;ve received your request and are preparing pricing. We&apos;ll email you once it&apos;s ready.
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {quotation.items.map((item) => (
            <div key={item.product} className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                {item.name} &times; {item.quantity}
                {item.discountPercent > 0 && (
                  <Badge variant="brand" className="ml-2">
                    -{item.discountPercent}%
                  </Badge>
                )}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="space-y-1.5 border-t border-slate-100 pt-3 text-sm dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span className="text-slate-900 dark:text-slate-100">{formatCurrency(quotation.subtotal)}</span>
            </div>
            {quotation.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tax</span>
                <span className="text-slate-900 dark:text-slate-100">{formatCurrency(quotation.tax)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Delivery fee</span>
              <span className="text-slate-900 dark:text-slate-100">{formatCurrency(quotation.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
              <span>Total</span>
              <span>{formatCurrency(quotation.total)}</span>
            </div>
          </div>
          {quotation.validUntil && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isExpired ? 'Expired on' : 'Valid until'} {formatDate(quotation.validUntil)}
            </p>
          )}
        </CardBody>
      </Card>

      {quotation.status === 'QUOTED' && !isExpired && (
        <Card>
          <CardHeader>
            <CardTitle>Accept this quotation</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { value: 'DELIVERY', label: 'Delivery', icon: Truck },
                { value: 'PICKUP', label: 'Pickup', icon: Store },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDeliveryMethod(option.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium',
                    deliveryMethod === option.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-500/10 dark:text-brand-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <option.icon className="h-4 w-4" /> {option.label}
                </button>
              ))}
            </div>

            {deliveryMethod === 'DELIVERY' && (
              <div className="space-y-2">
                {addresses?.map((address) => (
                  <button
                    key={address._id}
                    type="button"
                    onClick={() => setSelectedAddressId(address._id)}
                    className={cn(
                      'flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left text-sm',
                      selectedAddressId === address._id
                        ? 'border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    )}
                  >
                    <span>
                      <span className="block font-medium text-slate-900 dark:text-slate-100">{address.label}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {address.street}, {address.district}, {address.province}
                      </span>
                    </span>
                    {selectedAddressId === address._id && (
                      <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    )}
                  </button>
                ))}
                <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                  Add new address
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Contact name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input
                label="Contact phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Payment: Cash on Delivery/Pickup</p>

            <div className="flex gap-3">
              <Button isLoading={isAccepting} onClick={handleAccept} className="flex-1">
                Accept &amp; place order
              </Button>
              <Button variant="outline" isLoading={isDeclining} onClick={handleDecline}>
                Decline
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {quotation.status === 'ACCEPTED' && quotation.order && (
        <Button to={`/account/orders`} variant="outline">
          View resulting order
        </Button>
      )}

      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add address">
        <AddressForm onSubmit={handleAddAddress} onCancel={() => setIsAddressModalOpen(false)} isSubmitting={isSavingAddress} />
      </Modal>
    </div>
  );
}
