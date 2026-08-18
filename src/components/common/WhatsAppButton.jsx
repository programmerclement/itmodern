import Button from './Button.jsx';
import WhatsAppContactMenu from './WhatsAppContactMenu.jsx';
import { useWhatsAppContacts } from '../../hooks/useWhatsAppContacts.js';
import { useContactPicker } from '../../hooks/useContactPicker.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';

// Drop-in replacement for a plain `<Button href={waLink}>` — renders exactly
// like one when a single WhatsApp contact is configured, or a picker button
// that opens a "chat with" menu when the admin has set up more than one.
export default function WhatsAppButton({ message, ...buttonProps }) {
  const contacts = useWhatsAppContacts();
  const { isOpen, rect, triggerRef, panelRef, toggle, close } = useContactPicker();

  if (contacts.length === 0) return null;

  if (contacts.length === 1) {
    const link = buildWhatsAppLink(contacts[0].number, message);
    if (!link) return null;
    return <Button href={link} target="_blank" rel="noopener noreferrer" {...buttonProps} />;
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        {...buttonProps}
      />
      {isOpen && (
        <WhatsAppContactMenu panelRef={panelRef} rect={rect} contacts={contacts} message={message} onSelect={close} />
      )}
    </>
  );
}
