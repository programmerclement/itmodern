import { useEffect, useState } from 'react';
import { APP_NAME } from '../../constants/config.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';
import WhatsAppIcon from './WhatsAppIcon.jsx';
import { cn } from '../../utils/cn.js';

const MAX_UNREAD_COUNT = 9;
const UNREAD_TICK_MS = 15000;
const BOUNCE_DURATION_MS = 1000;

export default function WhatsAppFloatButton() {
  const [unreadCount, setUnreadCount] = useState(1);
  const [isBouncing, setIsBouncing] = useState(false);

  const link = buildWhatsAppLink(`Hello, I'd like to know more about your products at ${APP_NAME}.`);

  useEffect(() => {
    if (!link) return undefined;

    const intervalId = window.setInterval(() => {
      setUnreadCount((prev) => {
        if (prev >= MAX_UNREAD_COUNT) {
          window.clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
      setIsBouncing(true);
      window.setTimeout(() => setIsBouncing(false), BOUNCE_DURATION_MS);
    }, UNREAD_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [link]);

  if (!link) return null;

  return (
    <div className="group fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      <span
        className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-slate-700"
      >
        Need help? Chat with us
        <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900 dark:border-l-slate-700" />
      </span>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 active:scale-95',
          isBouncing && 'motion-reduce:animate-none animate-bounce'
        )}
      >
        <WhatsAppIcon className="h-7 w-7" />

        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5">
          <span className="motion-reduce:animate-none absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {unreadCount}
          </span>
        </span>
      </a>
    </div>
  );
}
