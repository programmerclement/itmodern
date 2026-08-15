import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin, Pencil, Trash2, Plus } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import AddressForm from '../../components/checkout/AddressForm.jsx';
import { useAddresses, ADDRESSES_QUERY_KEY } from '../../hooks/useAddresses.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as addressService from '../../services/addressService.js';

export default function Addresses() {
  const { data: addresses, isLoading } = useAddresses();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });

  const openAddModal = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleSubmit = async (formValue) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, formValue);
        toast.success('Address updated');
      } else {
        await addressService.createAddress(formValue);
        toast.success('Address added');
      }
      invalidate();
      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);
      invalidate();
      toast.success('Address removed');
    } catch (err) {
      toast.error('Could not remove address', err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      invalidate();
      toast.success('Default address updated');
    } catch (err) {
      toast.error('Could not update default address', err.message);
    }
  };

  if (isLoading) return <PageLoader label="Loading addresses" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Saved addresses</h1>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openAddModal}>
          Add address
        </Button>
      </div>

      {addresses?.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add a delivery address to speed up checkout."
          action={<Button onClick={openAddModal}>Add address</Button>}
        />
      ) : (
        <div className="space-y-3">
          {addresses?.map((address) => (
            <Card key={address._id}>
              <CardBody className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {address.label}
                    </span>
                    {address.isDefault && <Badge variant="brand">Default</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {address.recipientName} &middot; {address.phone}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {address.street}, {address.district}, {address.province}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(address)}
                      aria-label="Edit address"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(address._id)}
                      aria-label="Delete address"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address._id)}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAddress ? 'Edit address' : 'Add address'}
      >
        <AddressForm
          initialValue={editingAddress ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
