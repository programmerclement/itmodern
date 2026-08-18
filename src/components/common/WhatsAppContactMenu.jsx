import { createPortal } from 'react-dom';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';

const PANEL_WIDTH = 240;
const VIEWPORT_MARGIN = 12;
const MIN_PANEL_HEIGHT = 140;

export default function WhatsAppContactMenu({ panelRef, rect, contacts, message, onSelect }) {
  if (!rect) return null;

  // Flip above the trigger when there isn't enough room below — the
  // floating WhatsApp button sits at the bottom-right corner of the screen,
  // so opening downward there would render the panel off-screen entirely.
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
  const spaceAbove = rect.top - VIEWPORT_MARGIN;
  const openUpward = spaceBelow < MIN_PANEL_HEIGHT && spaceAbove > spaceBelow;

  const left = Math.min(
    Math.max(VIEWPORT_MARGIN, rect.left),
    window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN
  );

  const style = {
    position: 'fixed',
    left,
    maxHeight: Math.max(MIN_PANEL_HEIGHT, openUpward ? spaceAbove : spaceBelow),
    ...(openUpward
      ? { bottom: window.innerHeight - rect.top + 8 }
      : { top: rect.bottom + 8 }),
  };

  return createPortal(
    <div
      ref={panelRef}
      role="menu"
      style={style}
      className="z-50 w-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        Chat with
      </p>
      {contacts.map((contact, index) => {
        const link = buildWhatsAppLink(contact.number, message);
        if (!link) return null;
        return (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSelect}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
            <span className="min-w-0 flex-1 truncate">{contact.name || 'WhatsApp'}</span>
          </a>
        );
      })}
    </div>,
    document.body
  );
}
