import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Truck, Store, Plus, Check, Smartphone, Tag, X, Landmark } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import PriceTag from '../../components/product/PriceTag.jsx';
import AddressForm from '../../components/checkout/AddressForm.jsx';
import PayToDetails from '../../components/checkout/PayToDetails.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAddresses, ADDRESSES_QUERY_KEY } from '../../hooks/useAddresses.js';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import * as addressService from '../../services/addressService.js';
import * as orderService from '../../services/orderService.js';
import * as paymentService from '../../services/paymentService.js';
import * as couponService from '../../services/couponService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import {
  DELIVERY_FEE_RWF,
  FREE_DELIVERY_THRESHOLD_RWF,
  PAYMENT_METHODS_ONLINE,
  PAYMENT_METHODS_MANUAL,
  MOBILE_MONEY_NETWORKS,
} from '../../constants/checkout.js';
import { cn } from '../../utils/cn.js';

export default function Checkout() {
  const { items, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { data: settings } = useSiteSettings();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onlinePaymentEnabled = settings?.onlinePaymentEnabled ?? true;
  const paymentMethods = onlinePaymentEnabled ? PAYMENT_METHODS_ONLINE : PAYMENT_METHODS_MANUAL;

  const [deliveryMethod, setDeliveryMethod] = useState('DELIVERY');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name ?? '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState('MTN');
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState(user?.phone ?? '');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    if (itemCount === 0) navigate('/cart', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addresses?.length && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddress._id);
    }
  }, [addresses, selectedAddressId]);

  const deliveryFee =
    deliveryMethod === 'DELIVERY' && subtotal < FREE_DELIVERY_THRESHOLD_RWF ? DELIVERY_FEE_RWF : 0;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal + deliveryFee - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const result = await couponService.validateCoupon(couponInput.trim(), subtotal);
      setAppliedCoupon(result.data);
      toast.success('Coupon applied');
    } catch (err) {
      toast.error('Invalid coupon', err.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
  };

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

  const handlePlaceOrder = async () => {
    if (deliveryMethod === 'DELIVERY' && !selectedAddressId) {
      toast.error('Select a delivery address');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Contact name and phone are required');
      return;
    }
    if (paymentMethod === 'MOBILE_MONEY' && !mobileMoneyPhone.trim()) {
      toast.error('Enter the phone number to charge for mobile money');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const result = await orderService.checkout({
        deliveryMethod,
        addressId: deliveryMethod === 'DELIVERY' ? selectedAddressId : undefined,
        paymentMethod,
        customerName,
        customerPhone,
        notes,
        couponCode: appliedCoupon?.code,
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      const orderNumber = result.data.order.orderNumber;

      if (paymentMethod === 'MOBILE_MONEY') {
        try {
          await paymentService.initiatePayment({
            orderNumber,
            network: mobileMoneyNetwork,
            phone: mobileMoneyPhone,
          });
        } catch (paymentErr) {
          toast.error(
            'Order placed, but payment could not be started',
            `${paymentErr.message} — you can retry payment from your order page.`
          );
        }
      }

      navigate(`/order-confirmation/${orderNumber}`);
    } catch (err) {
      toast.error('Could not place order', err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery method</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { value: 'DELIVERY', label: 'Delivery', icon: Truck, description: 'Delivered to your address' },
                { value: 'PICKUP', label: 'Pickup', icon: Store, description: 'Collect in person, no fee' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDeliveryMethod(option.value)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                    deliveryMethod === option.value
                      ? 'border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  )}
                >
                  <option.icon className="mt-0.5 h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <span>
                    <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                      {option.label}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{option.description}</span>
                  </span>
                </button>
              ))}
            </CardBody>
          </Card>

          {deliveryMethod === 'DELIVERY' && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery address</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                {addressesLoading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading addresses...</p>
                ) : (
                  addresses?.map((address) => (
                    <button
                      key={address._id}
                      type="button"
                      onClick={() => setSelectedAddressId(address._id)}
                      className={cn(
                        'flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left',
                        selectedAddressId === address._id
                          ? 'border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                      )}
                    >
                      <span>
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {address.label}
                          {address.isDefault && <Badge variant="brand">Default</Badge>}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                          {address.recipientName} &middot; {address.phone}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {address.street}, {address.district}, {address.province}
                        </span>
                      </span>
                      {selectedAddressId === address._id && (
                        <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                      )}
                    </button>
                  ))
                )}

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  Add new address
                </Button>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Contact information</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input
                label="Phone number"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Input
                label="Order notes"
                placeholder="Optional"
                className="sm:col-span-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border p-4',
                    !method.available && 'cursor-not-allowed opacity-50',
                    method.available && paymentMethod === method.value
                      ? 'border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-700'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled={!method.available}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{method.label}</span>
                  </span>
                  {!method.available && <Badge variant="neutral">Coming soon</Badge>}
                </label>
              ))}

              {paymentMethod === 'MOBILE_MONEY' && (
                <div className="mt-2 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Smartphone className="h-4 w-4" /> You'll be prompted on your phone to approve the payment.
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                      label="Network"
                      value={mobileMoneyNetwork}
                      onChange={(e) => setMobileMoneyNetwork(e.target.value)}
                    >
                      {MOBILE_MONEY_NETWORKS.map((network) => (
                        <option key={network.value} value={network.value}>
                          {network.label}
                        </option>
                      ))}
                    </Select>
                    <Input
                      label="Mobile money phone"
                      type="tel"
                      required
                      placeholder="07XXXXXXXX"
                      value={mobileMoneyPhone}
                      onChange={(e) => setMobileMoneyPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'MANUAL_TRANSFER' && (
                <div className="mt-2 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Landmark className="h-4 w-4" /> Pay to one of the accounts below, then place your order — we'll
                    confirm receipt and start processing it.
                  </p>
                  <PayToDetails settings={settings} amount={total} />
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.productId} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      {item.product.name} &times; {item.quantity}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" /> {appliedCoupon.code} applied
                    </span>
                    <button type="button" onClick={handleRemoveCoupon} aria-label="Remove coupon">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    />
                    <Button variant="outline" isLoading={isApplyingCoupon} onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 border-t border-slate-100 pt-3 text-sm dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="text-slate-900 dark:text-slate-100">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Delivery fee</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                <PriceTag price={total} size="lg" />
              </div>
              <Button className="w-full" isLoading={isPlacingOrder} onClick={handlePlaceOrder}>
                Place order
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add address">
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={() => setIsAddressModalOpen(false)}
          isSubmitting={isSavingAddress}
        />
      </Modal>
    </div>
  );
}
