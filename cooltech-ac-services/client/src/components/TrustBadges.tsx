/**
 * TrustBadges — Inline trust signals shown on the Booking confirmation step.
 * Reduces drop-off at the payment stage.
 * Item #13 of the 13 UX improvements.
 */
import { ShieldCheck, Clock, Star, CreditCard } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "100% Satisfaction Guarantee" },
  { icon: Clock,       label: "Same-Day Service Available" },
  { icon: Star,        label: "Certified Technicians" },
  { icon: CreditCard,  label: "Secure Online Payment" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 bg-slate-50 border border-border rounded-lg px-3 py-2"
        >
          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-xs text-muted-foreground leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}
