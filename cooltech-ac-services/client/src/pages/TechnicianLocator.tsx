import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import { MapPin, Navigation, Search, CheckCircle, Clock, Star, Phone, ArrowRight } from "lucide-react";

// Delhi NCR center coordinates
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

export default function TechnicianLocator() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedTech, setSelectedTech] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const { data: technicians } = trpc.technicians.available.useQuery();

  const filtered = (technicians ?? []).filter((t) =>
    !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // Place technician markers
    if (technicians) {
      technicians.forEach((tech) => {
        if (!tech.latitude || !tech.longitude) return;
        const lat = tech.latitude;
        const lng = tech.longitude;

        const markerEl = document.createElement("div");
        markerEl.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #1e3a5f, #0891b2);
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid white;
            cursor: pointer;
          ">🔧</div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          title: tech.name,
          content: markerEl,
        });

        marker.addListener("click", () => {
          setSelectedTech(tech.id);
          map.panTo({ lat, lng });
          map.setZoom(15);
        });

        markersRef.current.push(marker);
      });
    }
  }, [technicians]);

  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(14);

          // Add user location marker
          const el = document.createElement("div");
          el.innerHTML = `
            <div style="
              background: #3b82f6;
              color: white;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              border: 3px solid white;
              box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
            "></div>
          `;
          new google.maps.marker.AdvancedMarkerElement({ map: mapRef.current, position: loc, title: "You", content: el });
        }
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const selectedTechData = technicians?.find((t) => t.id === selectedTech);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero text-white py-10">
        <div className="container">
          <Badge className="mb-3 bg-white/10 text-white border-white/20">GPS Locator</Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Find Technicians Near You
          </h1>
          <p className="text-white/70 max-w-xl">
            See available AC technicians in real time on the map. Choose the closest expert for fastest service.
          </p>
        </div>
      </section>

      <div className="flex-1 bg-slate-50">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Search + Locate */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search technician..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white"
                  />
                </div>
                <Button
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="gradient-brand text-white border-0 gap-1.5 flex-shrink-0"
                >
                  <Navigation className="w-4 h-4" />
                  {isLocating ? "..." : "Near Me"}
                </Button>
              </div>

              {/* Technician List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No technicians found.</p>
                ) : (
                  filtered.map((tech) => {
                    const specs: string[] = tech.specializations ? JSON.parse(tech.specializations) : [];
                    const isSelected = selectedTech === tech.id;
                    return (
                      <Card
                        key={tech.id}
                        className={`cursor-pointer transition-all ${isSelected ? "border-primary shadow-md" : "hover:shadow-sm"}`}
                        onClick={() => {
                          setSelectedTech(tech.id);
                          if (mapRef.current && tech.latitude && tech.longitude) {
                            mapRef.current.panTo({ lat: tech.latitude, lng: tech.longitude });
                            mapRef.current.setZoom(15);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src={tech.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`}
                                alt={tech.name}
                                className="w-12 h-12 rounded-xl object-cover bg-muted"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${tech.isAvailable ? "bg-green-500" : "bg-amber-500"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="font-semibold text-sm text-foreground truncate">{tech.name}</p>
                                {tech.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                              </div>
                              <StarRating rating={parseFloat(tech.rating ?? "4.8")} reviewCount={tech.reviewCount ?? 0} size="sm" />
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>Delhi NCR</span>
                                <span>·</span>
                                <Clock className="w-3 h-3" />
                                <span>~{Math.floor(Math.random() * 20) + 5} min</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {specs.slice(0, 2).map((s) => (
                                  <Badge key={s} variant="secondary" className="text-[10px] py-0">{s}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex gap-2 mt-3 pt-3 border-t">
                              <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs">
                                <Phone className="w-3 h-3" /> Call
                              </Button>
                              <Link href={`/technicians/${tech.id}`} className="flex-1">
                                <Button size="sm" variant="outline" className="w-full gap-1 text-xs">
                                  <Star className="w-3 h-3" /> Profile
                                </Button>
                              </Link>
                              <Link href={`/book`} className="flex-1">
                                <Button size="sm" className="w-full gradient-brand text-white border-0 gap-1 text-xs">
                                  Book <ArrowRight className="w-3 h-3" />
                                </Button>
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-md">
                <div className="p-3 border-b bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">{filtered.length} technicians available</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> Available</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500" /> Busy</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500" /> You</div>
                  </div>
                </div>
                <MapView
                  className="h-[550px]"
                  initialCenter={DEFAULT_CENTER}
                  initialZoom={12}
                  onMapReady={handleMapReady}
                />
              </Card>

              {/* Selected Technician Detail */}
              {selectedTechData && (
                <Card className="mt-4 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedTechData.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTechData.name}`}
                          alt={selectedTechData.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-foreground">{selectedTechData.name}</p>
                          <StarRating rating={parseFloat(selectedTechData.rating ?? "4.8")} reviewCount={selectedTechData.reviewCount ?? 0} size="sm" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/technicians/${selectedTechData.id}`}>
                          <Button variant="outline" size="sm">View Profile</Button>
                        </Link>
                        <Link href="/book">
                          <Button size="sm" className="gradient-brand text-white border-0">Book Now</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
