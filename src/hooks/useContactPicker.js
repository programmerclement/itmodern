import { useEffect, useRef, useState } from 'react';

// Shared open/close/positioning logic for a button that opens a portaled
// flyout panel anchored to itself (used by the WhatsApp contact picker).
export function useContactPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (triggerRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggle = () => {
    if (!isOpen) setRect(triggerRef.current?.getBoundingClientRect() ?? null);
    setIsOpen((prev) => !prev);
  };

  const close = () => setIsOpen(false);

  return { isOpen, rect, triggerRef, panelRef, toggle, close };
}
