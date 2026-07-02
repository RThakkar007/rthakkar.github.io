import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Snowflake, Zap, Shield, Star, CheckCircle2, ArrowRight,
  Clock, MapPin, Wrench, ThumbsUp, ChevronDown, Phone,
  CalendarCheck, UserCheck, Truck
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Wrench, name: "AC Repair", price: "₹499", desc: "Fast diagnosis & fix for all AC faults", popular: false },
  { icon: Snowflake, name: "Gas Refill", price: "₹799", desc: "Refrigerant top-up with leak check", popular: true },
  { icon: Zap, name: "Installation", price: "₹1,299", desc: "Expert installation of split & window ACs", popular: false },
  { icon: Shield, name: "Annual AMC", price: "₹1,999/yr", desc: "2 services + priority support all year", popular: false },
  { icon: CheckCircle2, name: "Deep Cleaning", price: "₹599", desc: "Full coil & filter cleaning for better cooling", popular: false },
  { icon: Star, name: "Uninstallation", price: "₹399", desc: "Safe removal & packing of your AC unit", popular: false },
];

const HOW_IT_WORKS = [
  { icon: CalendarCheck, step: "01", title: "Book in 60 Seconds", desc: "Select your service, pick a date & time, and enter your address." },
  { icon: UserCheck, step: "02", title: "Technician Assigned", desc: "Our nearest verified technician is auto-assigned to your job." },
  { icon: Truck, step: "03", title: "Track in Real Time", desc: "Get live updates — Assigned → On the Way → Completed." },
  { icon: ThumbsUp, step: "04", title: "Job Done & Paid", desc: "Pay on delivery (COD) or online. Rate your experience." },
];

const TESTIMONIALS = [
  { name: "Priya S.", city: "Mumbai", rating: 5, text: "Booked at 10 AM, technician arrived by noon. AC is cooling perfectly now. Super fast service!" },
  { name: "Rahul M.", city: "Pune", rating: 5, text: "The app tracking is amazing — I could see exactly when the technician was on his way. Very professional." },
  { name: "Anita K.", city: "Bangalore", rating: 5, text: "Annual AMC plan is great value. Two services done, zero hassle. Highly recommend ArcticAC." },
  { name: "Vikram T.", city: "Delhi", rating: 5, text: "Gas refill done in 45 minutes. Technician was knowledgeable and explained everything clearly." },
];

const FAQS = [
  { q: "How quickly can a technician arrive?", a: "Most bookings are fulfilled within 2–4 hours. Same-day service is available for slots before 4 PM." },
  { q: "What brands do you service?", a: "We service all major AC brands — Daikin, Voltas, LG, Samsung, Blue Star, Hitachi, Carrier, and more." },
  { q: "Is there a service charge if the problem isn't fixed?", a: "A minimal ₹99 visit charge applies if no repair is needed. All repair costs are quoted upfront before work begins." },
  { q: "How do I track my technician?", a: "Once assigned, you'll receive a booking reference. Use it on the Track Booking page for live status updates." },
  { q: "What payment methods are accepted?", a: "Cash on Delivery (COD) is the default. Online payment via Razorpay (UPI, cards, net banking) is also available." },
  { q: "Can I reschedule or cancel my booking?", a: "Yes — free cancellation up to 2 hours before the scheduled time. See our Cancellation Policy for details." },
];

const TRUST_STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "50+", label: "Expert Technicians" },
  { value: "4.9★", label: "Average Rating" },
  { value: "< 4hr", label: "Avg Response Time" },
];

// ── Components ────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/60 transition-colors"
      >
        <span className="font-medium text-foreground text-sm sm:text-base">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 ml-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-2xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl">
            <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-medium">
              <Snowflake className="h-3 w-3 mr-1.5" /> {t.hero_badge}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5">
              {t.hero_title_1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                {t.hero_title_2}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Professional AC repair, installation & maintenance with real-time technician tracking.
              Book in 60 seconds — get service today.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/book">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25">
                  {t.hero_book_cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border hover:bg-card">
                  {t.hero_track_cta}
                </Button>
              </Link>
            </div>
            {/* Trust stats row */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_STATS.map(({ value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground"><strong className="text-foreground">{value}</strong> {label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Preview ── */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.services_title}</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
              {t.services_subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map(({ icon: Icon, name, price, desc, popular }) => (
              <div key={name} className={`relative rounded-xl border p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${popular ? "border-primary/40 bg-primary/5" : "border-border bg-card/50"}`}>
                {popular && (
                  <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold text-primary">{price}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{desc}</p>
                <Link href="/book">
                  <Button size="sm" variant="outline" className="w-full text-xs border-border hover:border-primary hover:text-primary">
                    {t.services_book_now}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline" className="border-border hover:border-primary hover:text-primary">
                {t.services_view_all} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.how_title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{t.how_subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }, idx) => (
              <div key={step} className="relative text-center">
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-px bg-border" />
                )}
                <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.trust_title}</h2>
              <p className="text-muted-foreground mb-8 text-sm sm:text-base">
                We combine technology with trained professionals to deliver the fastest, most reliable AC service experience.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: "Verified Technicians", desc: "Every technician is background-checked, trained, and carries a photo ID." },
                  { icon: Clock, title: "Same-Day Service", desc: "Book before 4 PM and get your AC serviced the same day in most areas." },
                  { icon: MapPin, title: "Real-Time Tracking", desc: "Track your technician live — from assignment to arrival to job completion." },
                  { icon: Star, title: "30-Day Warranty", desc: "All repairs come with a 30-day workmanship warranty. We stand behind our work." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-0.5">{title}</h4>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Stats card */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Happy Customers", color: "text-primary" },
                { value: "50+", label: "Expert Technicians", color: "text-cyan-400" },
                { value: "4.9 / 5", label: "Customer Rating", color: "text-yellow-400" },
                { value: "98%", label: "Completion Rate", color: "text-green-400" },
              ].map(({ value, label, color }) => (
                <div key={label} className="rounded-xl border border-border bg-card/50 p-5 text-center">
                  <div className={`text-3xl font-extrabold ${color} mb-1`}>{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.testimonials_title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{t.testimonials_subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIALS.map(({ name, city, rating, text }) => (
              <div key={name} className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{name}</div>
                    <div className="text-[10px] text-muted-foreground">{city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.faq_title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{t.faq_subtitle}</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-cyan-500/5 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <Snowflake className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.cta_title}</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base">
                {t.cta_subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/book">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25">
                    Book a Service <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="tel:+919999999999">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border hover:border-primary hover:text-primary">
                    <Phone className="mr-2 h-4 w-4" /> Call Us Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
