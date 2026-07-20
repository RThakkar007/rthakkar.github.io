/**
 * PriceEstimator — Quick "Get Estimate" tool on the Home / Services page.
 * User selects AC brand, tonnage, and issue type → gets an instant price range.
 * Item #7 of the 13 UX improvements.
 */
import { useState } from "react";
import { Calculator, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const BRANDS = ["Daikin", "Voltas", "LG", "Samsung", "Blue Star", "Hitachi", "Carrier", "Other"];
const TONNAGES = ["0.75 Ton", "1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton+"];
const ISSUES = [
  { label: "Not Cooling",   min: 499,  max: 1299 },
  { label: "Gas Refill",    min: 799,  max: 1299 },
  { label: "Installation",  min: 1299, max: 2499 },
  { label: "Deep Cleaning", min: 349,  max: 599  },
  { label: "PCB / Electrical", min: 799, max: 1999 },
  { label: "Annual AMC",    min: 1999, max: 1999  },
];

export function PriceEstimator() {
  const [brand, setBrand]     = useState("");
  const [tonnage, setTonnage] = useState("");
  const [issue, setIssue]     = useState("");
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);

  const selectClass =
    "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer";

  function handleEstimate() {
    const found = ISSUES.find((i) => i.label === issue);
    if (!found) return;
    // Slight premium for larger tonnage
    const tonMultiplier = tonnage.startsWith("2") ? 1.2 : 1;
    setEstimate({
      min: Math.round(found.min * tonMultiplier),
      max: Math.round(found.max * tonMultiplier),
    });
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Get an Instant Estimate</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Brand */}
        <div className="relative">
          <select className={selectClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">AC Brand</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        {/* Tonnage */}
        <div className="relative">
          <select className={selectClass} value={tonnage} onChange={(e) => setTonnage(e.target.value)}>
            <option value="">AC Tonnage</option>
            {TONNAGES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        {/* Issue */}
        <div className="relative">
          <select className={selectClass} value={issue} onChange={(e) => setIssue(e.target.value)}>
            <option value="">Service Type</option>
            {ISSUES.map((i) => <option key={i.label} value={i.label}>{i.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <button
        onClick={handleEstimate}
        disabled={!brand || !tonnage || !issue}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground font-semibold text-sm py-2.5 rounded-lg transition-all duration-200 active:scale-95"
      >
        Calculate Estimate
      </button>

      {estimate && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl text-center animate-in fade-in duration-300">
          <p className="text-xs text-muted-foreground mb-1">Estimated Service Cost</p>
          <p className="text-2xl font-bold text-primary">
            ₹{estimate.min.toLocaleString("en-IN")}
            {estimate.min !== estimate.max && ` – ₹${estimate.max.toLocaleString("en-IN")}`}
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">Final price confirmed before work begins</p>
          <Link href="/book">
            <a className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Book Now <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}

