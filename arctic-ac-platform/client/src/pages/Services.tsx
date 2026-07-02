import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Snowflake, Zap, Shield, Star, CheckCircle2, ArrowRight,
  Wrench, Wind, Thermometer, Settings, Phone
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

const STATIC_SERVICES = [
  {
    icon: Wrench, name: "AC Repair", price: "₹499", priceNote: "Starting price",
    desc: "Fast diagnosis and repair for all AC faults — cooling issues, noise, leaks, and more.",
    features: ["All brands covered", "Upfront quote before work", "30-day repair warranty", "Genuine spare parts"],
    popular: false, color: "text-blue-400", bg: "bg-blue-400/10",
  },
  {
    icon: Snowflake, name: "Gas Refill", price: "₹799", priceNote: "Per unit",
    desc: "Refrigerant top-up with full leak detection. Supports R22, R32, R410A and all modern types.",
    features: ["Leak detection included", "All refrigerant types", "Pressure test after fill", "Cooling performance check"],
    popular: true, color: "text-cyan-400", bg: "bg-cyan-400/10",
  },
  {
    icon: Zap, name: "AC Installation", price: "₹1,299", priceNote: "Per unit (up to 1.5 ton)",
    desc: "Professional installation of split, window, and cassette ACs with piping and testing.",
    features: ["Split & window AC", "Piping up to 3 metres", "Electrical connection", "Post-install testing"],
    popular: false, color: "text-yellow-400", bg: "bg-yellow-400/10",
  },
  {
    icon: Wind, name: "Deep Cleaning", price: "₹599", priceNote: "Per unit",
    desc: "Full coil, filter, and drain cleaning for better cooling efficiency and air quality.",
    features: ["Indoor & outdoor unit", "Filter wash & dry", "Drain pipe cleaning", "Sanitisation spray"],
    popular: false, color: "text-green-400", bg: "bg-green-400/10",
  },
  {
    icon: Shield, name: "Annual AMC", price: "₹1,999", priceNote: "Per year per unit",
    desc: "Annual Maintenance Contract — 2 scheduled services + priority support + 10% discount on repairs.",
    features: ["2 services included", "Priority booking", "10% repair discount", "Free gas top-up check"],
    popular: false, color: "text-purple-400", bg: "bg-purple-400/10",
  },
  {
    icon: Settings, name: "Uninstallation", price: "₹399", priceNote: "Per unit",
    desc: "Safe removal and packing of your AC unit. Ideal when moving home or replacing old units.",
    features: ["Safe gas recovery", "Pipe capping", "Wall patching", "Packing & handover"],
    popular: false, color: "text-orange-400", bg: "bg-orange-400/10",
  },
  {
    icon: Thermometer, name: "PCB / Electrical Repair", price: "₹699", priceNote: "Starting price",
    desc: "Circuit board, capacitor, and electrical component repair for all AC models.",
    features: ["PCB diagnosis", "Capacitor replacement", "Wiring check", "Warranty on parts"],
    popular: false, color: "text-red-400", bg: "bg-red-400/10",
  },
  {
    icon: Star, name: "Comprehensive Service", price: "₹999", priceNote: "Per unit",
    desc: "Full service package — cleaning + gas check + electrical check + performance test.",
    features: ["Full cleaning", "Gas level check", "Electrical inspection", "Performance report"],
    popular: false, color: "text-pink-400", bg: "bg-pink-400/10",
  },
];

export default function Services() {
  const { data: dbServices } = trpc.services.list.useQuery();
  const services = dbServices && dbServices.length > 0 ? null : STATIC_SERVICES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
        </div>
        <div className="container relative text-center max-w-2xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs">
            <Snowflake className="h-3 w-3 mr-1.5" /> All Services
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Professional AC Services at{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Transparent Prices
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-8">
            No hidden charges. Upfront quotes. 30-day workmanship warranty on all services.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {["All AC Brands", "Same-Day Service", "Verified Technicians", "COD Available"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {STATIC_SERVICES.map(({ icon: Icon, name, price, priceNote, desc, features, popular, color, bg }) => (
              <div
                key={name}
                className={`relative rounded-xl border p-5 flex flex-col transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${popular ? "border-primary/40 bg-primary/5" : "border-border bg-card/50"}`}
              >
                {popular && (
                  <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                )}
                <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="mb-2">
                  <h3 className="font-semibold text-foreground text-sm leading-snug">{name}</h3>
                </div>
                <div className="mb-3">
                  <span className={`text-2xl font-extrabold ${color}`}>{price}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">{priceNote}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1">{desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/book?service=${encodeURIComponent(name)}`}>
                  <Button size="sm" className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary text-xs transition-all">
                    Book Now <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-20">
        <div className="container">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-cyan-500/5 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Not sure which service you need?</h3>
              <p className="text-muted-foreground text-sm">Call us and our team will guide you to the right service.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a href="tel:+919999999999">
                <Button size="lg" variant="outline" className="border-border hover:border-primary hover:text-primary h-11">
                  <Phone className="mr-2 h-4 w-4" /> Call Us
                </Button>
              </a>
              <Link href="/book">
                <Button size="lg" className="bg-primary hover:bg-primary/90 h-11 px-6 shadow-lg shadow-primary/20">
                  Book Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="pb-20">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6">We service all major brands</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Daikin", "Voltas", "LG", "Samsung", "Blue Star", "Hitachi", "Carrier", "Panasonic", "Whirlpool", "O General"].map((brand) => (
              <span key={brand} className="px-4 py-2 rounded-lg border border-border bg-card/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
