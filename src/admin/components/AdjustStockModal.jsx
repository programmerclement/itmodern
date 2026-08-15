import { useState } from 'react';
import Modal from '../../components/common/Modal.jsx';
import Select from '../../components/common/Select.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as inventoryService from '../../services/inventoryService.js';

export default function AdjustStockModal({ isOpen, onClose, product, onAdjusted }) {
  const toast = useToast();
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!quantity || !reason.trim()) {
      toast.error('Quantity and reason are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryService.adjustStock({
        productId: product._id ?? product.id,
        type,
        quantity: Number(quantity),
        reason,
      });
      toast.success('Stock updated');
      setQuantity('');
      setReason('');
      onAdjusted();
      onClose();
    } catch (err) {
      toast.error('Could not update stock', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust stock — ${product?.name ?? ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="IN">Stock in (received)</option>
          <option value="OUT">Stock out (damaged, lost)</option>
          <option value="ADJUST">Correction (signed amount)</option>
        </Select>
        <Input
          label="Quantity"
          type="number"
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          helperText={type === 'ADJUST' ? 'Use a negative number to decrease stock' : undefined}
        />
        <Input label="Reason" required value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Update stock
          </Button>
        </div>
      </form>
    </Modal>
  );
}
