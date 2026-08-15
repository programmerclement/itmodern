import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import CouponFormModal from '../components/CouponFormModal.jsx';
import { useAdminCoupons, ADMIN_COUPONS_KEY } from '../../hooks/useAdminCoupons.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as couponService from '../../services/couponService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Coupons() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_KEY });

  const openAdd = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon._id, payload);
        toast.success('Coupon updated');
      } else {
        await couponService.createCoupon(payload);
        toast.success('Coupon created');
      }
      invalidate();
      setModalOpen(false);
    } catch (err) {
      toast.error('Could not save coupon', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (coupon) => {
    try {
      await couponService.deleteCoupon(coupon._id);
      toast.success('Coupon deleted');
      invalidate();
    } catch (err) {
      toast.error('Could not delete coupon', err.message);
    }
  };

  if (isLoading) return <PageLoader label="Loading coupons" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Coupons</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          Add coupon
        </Button>
      </div>

      {coupons?.length === 0 ? (
        <EmptyState icon={Ticket} title="No coupons yet" action={<Button onClick={openAdd}>Add coupon</Button>} />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Usage</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {coupons?.map((coupon) => (
              <Tr key={coupon._id}>
                <Td className="font-medium text-slate-900">{coupon.code}</Td>
                <Td>{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatCurrency(coupon.value)}</Td>
                <Td>
                  {coupon.usedCount}
                  {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ''}
                </Td>
                <Td>
                  <Badge variant={coupon.isActive ? 'success' : 'neutral'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(coupon)}
                      aria-label="Edit coupon"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(coupon)}
                      aria-label="Delete coupon"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <CouponFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        coupon={editingCoupon}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
