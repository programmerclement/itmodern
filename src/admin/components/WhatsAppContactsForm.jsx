import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const EMPTY_CONTACT = { name: '', number: '' };

export default function WhatsAppContactsForm({ settings, onSubmit, isSubmitting }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (settings) {
      setContacts(settings.whatsappContacts?.length ? settings.whatsappContacts : []);
    }
  }, [settings]);

  const updateContact = (index, patch) => {
    setContacts((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };
  const addContact = () => setContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
  const removeContact = (index) => setContacts((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ whatsappContacts: contacts });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-500">
        Add one number per staff member who handles chats. With only one set up, "Chat on WhatsApp" buttons open it
        directly; with more than one, customers get to pick who to message.
      </p>
      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-12 sm:items-end">
            <div className="sm:col-span-5">
              <Input
                label="Name"
                placeholder="e.g. Sales — Clement"
                value={contact.name}
                onChange={(e) => updateContact(index, { name: e.target.value })}
              />
            </div>
            <div className="sm:col-span-6">
              <Input
                label="WhatsApp number"
                placeholder="07XX XXX XXX"
                value={contact.number}
                onChange={(e) => updateContact(index, { number: e.target.value })}
              />
            </div>
            <div className="flex justify-end sm:col-span-1">
              <button
                type="button"
                onClick={() => removeContact(index)}
                aria-label="Remove contact"
                className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addContact}>
          Add contact
        </Button>
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save WhatsApp contacts
        </Button>
      </div>
    </form>
  );
}
