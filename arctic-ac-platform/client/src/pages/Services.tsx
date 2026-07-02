import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Thermometer, Clock } from "lucide-react";

const CATEGORIES = ["All", "Installation", "Repair", "Maintenance", "AMC"];

export default function Services() {
  const { data: services, isLoading } = trpc.services.list.useQuery();
  const displayServices = services && services.length > 0 ? services : DEMO_SERVICES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-8">
        <div className="container">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">All Services</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AC Services We Offer
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            Professional AC services for all brands — Samsung, LG, Daikin, Voltas, Blue Star, and more.
          </p>
        </div>
      </div>
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayServices.map((s, i) => (
                <Card key={i} className="glass-card hover:border-primary/40 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Thermometer className="w-6 h-6 text-primary" />
                      </div>
                      {s.category && <Badge variant="outline" className="text-xs">{s.category}</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{s.description ?? "Professional service by certified technicians."}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> {s.duration ?? 60} min
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-primary font-bold text-xl">₹{s.price}</span>
                      <Button size="sm" className="btn-glow" asChild>
                        <Link href={`/book?service=${s.id}`}>Book Now <ArrowRight className="ml-1 w-3 h-3" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const DEMO_SERVICES = [
  { id: 1, name: "AC Installation", description: "Professional split/window AC installation with warranty and testing.", price: "999", duration: 120, category: "Installation" },
  { id: 2, name: "AC Repair", description: "Diagnose and fix all AC faults — cooling issues, leaks, noise, compressor.", price: "499", duration: 60, category: "Repair" },
  { id: 3, name: "AC Service & Cleaning", description: "Deep clean, filter wash, coil cleaning for peak performance.", price: "349", duration: 90, category: "Maintenance" },
  { id: 4, name: "Gas Refill (Recharge)", description: "Refrigerant top-up for all AC brands and models.", price: "1299", duration: 45, category: "Repair" },
  { id: 5, name: "PCB Repair", description: "Circuit board diagnostics and repair by certified engineers.", price: "799", duration: 60, category: "Repair" },
  { id: 6, name: "AMC Plan", description: "Annual maintenance contract — 2 services + priority support.", price: "1999", duration: 90, category: "AMC" },
  { id: 7, name: "Deep Cleaning", description: "Full AC unit deep cleaning including indoor and outdoor units.", price: "699", duration: 120, category: "Maintenance" },
  { id: 8, name: "Uninstallation", description: "Safe removal and uninstallation of your existing AC unit.", price: "399", duration: 60, category: "Installation" },
];
