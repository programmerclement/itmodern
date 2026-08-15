import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Textarea from '../common/Textarea.jsx';
import Button from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as quotationService from '../../services/quotationService.js';

export default function RequestQuotationModal({ isOpen, onClose, items }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await quotationService.requestQuotation({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        companyName,
        contactPerson,
        contactPhone,
        notes,
      });
      toast.success('Quotation requested', "We'll get back to you with pricing soon.");
      onClose();
      navigate(`/account/quotations/${result.data.quotation.quotationNumber}`);
    } catch (err) {
      toast.error('Could not request quotation', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a quotation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We&apos;ll prepare pricing for the {items.length} item{items.length === 1 ? '' : 's'} in your cart.
        </p>
        <Input label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Contact person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          <Input label="Contact phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        </div>
        <Textarea
          label="Notes"
          placeholder="Delivery requirements, timeline, or anything else we should know"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Request quotation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
