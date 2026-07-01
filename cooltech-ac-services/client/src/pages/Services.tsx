import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { trpc } from "@/lib/trpc";
import { Search, SlidersHorizontal, Wind, Wrench, Thermometer, Settings, Package } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Services", icon: SlidersHorizontal },
  { id: "cleaning", label: "Foam-jet Cleaning", icon: Wind },
  { id: "repair", label: "AC Repair", icon: Wrench },
  { id: "gas", label: "Gas Refill", icon: Thermometer },
  { id: "installation", label: "Installation", icon: Settings },
  { id: "uninstallation", label: "Uninstallation", icon: Package },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: services, isLoading } = trpc.services.list.useQuery();

  const filtered = (services ?? []).filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="gradient-hero text-white py-12">
        <div className="container">
          <Badge className="mb-3 bg-white/10 text-white border-white/20">AC Services</Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            All AC Services
          </h1>
          <p className="text-white/70 max-w-xl">
            Expert AC repair, installation, cleaning and more. Transparent pricing, trained professionals.
          </p>
        </div>
      </section>

      <section className="py-10 flex-1 bg-slate-50">
        <div className="container">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all btn-scale ${
                  activeCategory === cat.id
                    ? "gradient-brand text-white shadow-md"
                    : "bg-white text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No services found. Try a different search or category.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{filtered.length} service{filtered.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
