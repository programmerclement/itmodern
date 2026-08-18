import { useSiteSettings } from './useSiteSettings.js';

// Every "chat with us" button on the site reads from this — one shared list
// of staff WhatsApp lines configured by the admin in Settings.
export function useWhatsAppContacts() {
  const { data: settings } = useSiteSettings();
  return settings?.whatsappContacts?.filter((contact) => contact.number) ?? [];
}
