import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp CTA button — visible on all customer pages.
 * Phone number is configurable via the VITE_WHATSAPP_NUMBER env var (fallback to a placeholder).
 */
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || "919904089393";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I need help with my AC service booking.");

export function WhatsAppCTA() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg shadow-black/30 px-4 py-3 transition-all duration-200 hover:scale-105 active:scale-95 group"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}

