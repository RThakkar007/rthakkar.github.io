import { useState, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin, Navigation, Search, CheckCircle, Clock, Star,
  Phone, ArrowRight, Filter, Snowflake, Wind, Wrench, Zap, ThumbsUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Static technician data (works without backend) ────────────────────────────
const TECHNICIANS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    specialty: "Split AC Specialist",
    rating: 4.9,
    reviews: 142,
    experience: 8,
    distanceKm: 1.2,
    etaMin: 8,
    area: "Shankheshwar Road",
    isAvailable: true,
    isVerified: true,
    phone: "+91 98765 43210",
    specializations: ["Split AC", "Inverter AC", "Gas Refill"],
    completedJobs: 534,
    avatar: "RK",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Amit Sharma",
    specialty: "Gas Refill Expert",
    rating: 4.8,
    reviews: 98,
    experience: 6,
    distanceKm: 2.1,
    etaMin: 12,
    area: "Patan Chowk",
    isAvailable: true,
    isVerified: true,
    phone: "+91 98765 43211",
    specializations: ["Gas Refill", "AC Repair", "Maintenance"],
    completedJobs: 312,
    avatar: "AS",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    name: "Sunil Patel",
    specialty: "Installation Expert",
    rating: 4.8,
    reviews: 76,
    experience: 5,
    distanceKm: 3.4,
    etaMin: 18,
    area: "Siddhraj Nagar",
    isAvailable: false,
    isVerified: true,
    phone: "+91 98765 43212",
    specializations: ["Installation", "Uninstallation", "Split AC"],
    completedJobs: 228,
    avatar: "SP",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 4,
    name: "Vikram Singh",
    specialty: "Window AC Expert",
    rating: 4.7,
    reviews: 64,
    experience: 4,
    distanceKm: 4.0,
    etaMin: 22,
    area: "Station Road",
    isAvailable: true,
    isVerified: false,
    phone: "+91 98765 43213",
    specializations: ["Window AC", "Cassette AC", "Repair"],
    completedJobs: 189,
    avatar: "VS",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 5,
    name: "Pradeep Joshi",
    specialty: "Multi-brand Technician",
    rating: 4.6,
    reviews: 51,
    experience: 3,
    distanceKm: 5.2,
    etaMin: 28,
    area: "Hemchandracharya Road",
    isAvailable: true,
    isVerified: true,
    phone: "+91 98765 43214",
    specializations: ["All Brands", "Foam-jet Cleaning", "Gas Refill"],
    completedJobs: 143,
    avatar: "PJ",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 6,
    name: "Deepak Mehta",
    specialty: "Foam-jet Cleaning Pro",
    rating: 4.9,
    reviews: 113,
    experience: 7,
    distanceKm: 1.8,
    etaMin: 10,
    area: "Patan City Center",
    isAvailable: true,
    isVerified: true,
    phone: "+91 98765 43215",
    specializations: ["Foam-jet Cleaning", "Deep Service", "Maintenance"],
    completedJobs: 421,
    avatar: "DM",
    color: "from-sky-500 to-blue-500",
  },
];

const FILTER_OPTIONS = ["All", "Available", "Verified", "Nearest", "Top Rated"];
const SPEC_ICONS: Record<string, React.ReactNode> = {
  "Split AC": <Snowflake className="w-3 h-3" />,
  "Gas Refill": <Zap className="w-3 h-3" />,
  "Installation": <Wrench className="w-3 h-3" />,
  "Foam-jet Cleaning": <Wind className="w-3 h-3" />,
};

function StarRow({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
      <span className="text-xs font-semibold ml-0.5">{rating}</span>
      <span className="text-xs text-muted-foreground">({reviews})</span>
    </div>
  );
}

export default function Technicians() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  const handleLocateMe = useCallback(() => {
    setIsLocating(true);
    if (!navigator.geolocation) { setIsLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLabel(`${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        setIsLocating(false);
      },
      () => { setLocationLabel("Patan, Gujarat, India"); setIsLocating(false); }
    );
  }, []);

  const filtered = TECHNICIANS
    .filter((t) => {
      if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.specialty.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      if (activeFilter === "Available" && !t.isAvailable) return false;
      if (activeFilter === "Verified" && !t.isVerified) return false;
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === "Nearest") return a.distanceKm - b.distanceKm;
      if (activeFilter === "Top Rated") return b.rating - a.rating;
      return 0;
    });

  const selected = TECHNICIANS.find((t) => t.id === selectedId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container px-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {filtered.filter(t => t.isAvailable).length} Available Now
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Find Technicians <span className="text-primary">Near You</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mb-5">
            GPS-enabled technician locator. Choose the closest certified expert for fastest AC service.
          </p>

          {/* Location bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border max-w-lg">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Your location</p>
              <p className="text-sm font-medium truncate">{locationLabel ?? "Patan, Gujarat, India"}</p>
            </div>
            <Button
              size="sm"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="gap-1.5 flex-shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              {isLocating ? "Locating…" : "Detect"}
            </Button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="flex-1 container px-4 py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty or service…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> technicians
          {activeFilter !== "All" && <> · Filtered by <span className="text-primary font-medium">{activeFilter}</span></>}
        </p>

        {/* Technician grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No technicians found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((tech) => {
              const isSelected = selectedId === tech.id;
              return (
                <Card
                  key={tech.id}
                  onClick={() => setSelectedId(isSelected ? null : tech.id)}
                  className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? "border-primary shadow-lg ring-1 ring-primary/30"
                      : "hover:shadow-md hover:border-border/80"
                  }`}
                >
                  {/* Colour accent bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${tech.color}`} />

                  <CardContent className="p-5">
                    {/* Header row */}
                    <div className="flex items-start gap-3 mb-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative`}>
                        {tech.avatar}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${tech.isAvailable ? "bg-green-500" : "bg-amber-500"}`} />
                      </div>
                      {/* Name + status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-bold text-sm truncate">{tech.name}</p>
                          {tech.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" title="Verified" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{tech.specialty}</p>
                        <StarRow rating={tech.rating} reviews={tech.reviews} />
                      </div>
                      {/* Availability badge */}
                      <Badge
                        variant={tech.isAvailable ? "default" : "secondary"}
                        className={`text-[10px] flex-shrink-0 ${tech.isAvailable ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}
                      >
                        {tech.isAvailable ? "● Available" : "● Busy"}
                      </Badge>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-muted/30">
                      <div className="text-center">
                        <p className="text-sm font-bold">{tech.experience}</p>
                        <p className="text-[10px] text-muted-foreground">Yrs Exp</p>
                      </div>
                      <div className="text-center border-x border-border/50">
                        <p className="text-sm font-bold text-primary">{tech.distanceKm} km</p>
                        <p className="text-[10px] text-muted-foreground">Away</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-emerald-500">{tech.etaMin} min</p>
                        <p className="text-[10px] text-muted-foreground">ETA</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{tech.area}, Patan</span>
                      <span className="ml-auto flex items-center gap-1 text-muted-foreground/70">
                        <ThumbsUp className="w-3 h-3" />
                        {tech.completedJobs} jobs
                      </span>
                    </div>

                    {/* Specialization chips */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tech.specializations.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px] gap-1 py-0.5">
                          {SPEC_ICONS[s] ?? <Wrench className="w-3 h-3" />}
                          {s}
                        </Badge>
                      ))}
                    </div>

                    {/* Action buttons — always visible */}
                    <div className="flex gap-2">
                      <a href={`tel:${tech.phone}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5" />
                          Call
                        </Button>
                      </a>
                      <Link href="/book" className="flex-2 flex-grow">
                        <Button
                          size="sm"
                          className="w-full gap-1.5 text-xs bg-primary text-primary-foreground"
                          disabled={!tech.isAvailable}
                        >
                          Book Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>

                    {/* Expanded detail on selection */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>Typically responds within {tech.etaMin} minutes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-blue-500" />
                          <span>{tech.completedJobs} successfully completed jobs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span>{tech.rating} average rating from {tech.reviews} customers</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Can't find the right technician?</h3>
            <p className="text-sm text-muted-foreground">Book a service and we'll assign the best available expert to you automatically.</p>
          </div>
          <Link href="/book">
            <Button className="gap-2 flex-shrink-0">
              Book a Service
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
