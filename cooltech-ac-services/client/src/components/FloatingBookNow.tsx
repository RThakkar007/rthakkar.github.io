/**
 * FloatingBookNow — Sticky "Book Now" floating action button.
 * Appears after the user scrolls past the hero section.
 * Hidden on the /book page itself to avoid redundancy.
 * Item #1 of the 13 UX improvements.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { CalendarCheck } from "lucide-react";

export function FloatingBookNow() {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();
  const isBookPage = location.startsWith("/book");

  useEffect(() => {
    if (isBookPage) return;
    const handleScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBookPage]);

  if (isBookPage || !visible) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Link href="/book">
        <a className="flex items-center gap-2 gradient-brand hover:opacity-90 active:scale-95 text-white font-semibold text-sm px-5 py-3 rounded-full shadow-xl transition-all duration-200">
          <CalendarCheck className="w-4 h-4" />
          Book a Technician Now
        </a>
      </Link>
    </div>
  );
}
