import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import {
  Snowflake, Wrench, Zap, Shield, Clock, Star, CheckCircle,
  ArrowRight, Phone, MapPin, Thermometer, Wind, Settings
} from "lucide-react";

const HOW_IT_WORKS = [
  { step: "01", icon: Wrench, title: "Choose a Service", desc: "Browse our AC services and select what you need." },
  { step: "02", icon: Clock, title: "Pick a Time", desc: "Schedule at your convenience — same day available." },
  { step: "03", icon: MapPin, title: "Technician Arrives", desc: "GPS-tracked technician arrives at your doorstep." },
  { step: "04", icon: CheckCircle, title: "Job Done", desc: "Service completed, photo proof uploaded, payment collected." },
];

const FEATURES = [
  { icon: Zap, title: "Instant Assignment", desc: "GPS-based nearest technician auto-assigned in seconds." },
  { icon: MapPin, title: "Live Tracking", desc: "Track your technician in real time on the map." },
  { icon: Shield, title: "Verified Experts", desc: "All technicians are trained, verified, and insured." },
  { icon: Clock, title: "24/7 Availability", desc: "Emergency AC repairs available round the clock." },
  { icon: Star, title: "Transparent Pricing", desc: "No hidden charges. Fixed prices, paid after service." },
  { icon: Phone, title: "Direct Contact", desc: "One-tap call to your assigned technician." },
];

export default function Home() {
  const { data: services } = trpc.services.list.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center pt-16 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/8 blur-2xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Snowflake className="w-3 h-3 mr-1" /> On-Demand AC Services
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your AC Fixed,{" "}
              <span className="gradient-text">Fast & Reliable</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Professional AC repair, installation, and maintenance with real-time technician tracking. Book in 60 seconds, get service today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="btn-glow text-base px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto" asChild>
                <Link href="/book">Book a Service <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto" asChild>
                <Link href="/track/search">Track Booking</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 text-sm text-muted-foreground">
              {["500+ Happy Customers", "50+ Expert Technicians", "Same Day Service", "All AC Brands"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 section-gradient">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Services</Badge>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Everything Your AC Needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From quick repairs to full installations — we handle all AC brands and models.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services && services.length > 0 ? services : DEMO_SERVICES).slice(0, 6).map((s, i) => (
              <Card key={i} className="glass-card hover:border-primary/40 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Thermometer className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{s.description ?? "Professional AC service by certified technicians."}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">₹{s.price}</span>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary" asChild>
                      <Link href="/book">Book <ArrowRight className="ml-1 w-3 h-3" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild><Link href="/services">View All Services <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Simple. Fast. Reliable.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-border" />
                )}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-xs text-primary font-bold mb-1">{step.step}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 section-gradient">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why ArcticAC</Badge>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Built for Your Comfort</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="glass-card rounded-2xl p-6 sm:p-12 text-center arctic-glow">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ready to Fix Your AC?
            </h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">Book a service in 60 seconds. Expert technician at your door today.</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Button size="lg" className="btn-glow px-8 sm:px-10 h-12 sm:h-14 text-base w-full sm:w-auto" asChild>
                <Link href="/book">Book Now — It's Fast <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 sm:px-10 h-12 sm:h-14 text-base w-full sm:w-auto" asChild>
                <a href="tel:+919876543210"><Phone className="mr-2 w-5 h-5" /> Call Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const DEMO_SERVICES = [
  { name: "AC Installation", description: "Professional split/window AC installation with warranty.", price: "999" },
  { name: "AC Repair", description: "Diagnose and fix all AC faults — cooling issues, leaks, noise.", price: "499" },
  { name: "AC Service & Cleaning", description: "Deep clean, filter wash, coil cleaning for peak performance.", price: "349" },
  { name: "Gas Refill (Recharge)", description: "Refrigerant top-up for all AC brands and models.", price: "1299" },
  { name: "PCB Repair", description: "Circuit board diagnostics and repair by certified engineers.", price: "799" },
  { name: "AMC Plan", description: "Annual maintenance contract — 2 services + priority support.", price: "1999" },
];
