import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import {
  Navigation, Phone, MessageSquare, CheckCircle, Clock, MapPin,
  ArrowLeft, Snowflake, Zap, Shield
} from "lucide-react";

// Patan, Gujarat, India coordinates
const DEFAULT_CENTER = { lat: 23.8493, lng: 72.1266 };

// Simulate technician moving towards customer
function simulateMovement(start: { lat: number; lng: number }, end: { lat: number; lng: number }, progress: number) {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

export default function LiveTracking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const id = parseInt(bookingId ?? "0");

  const mapRef = useRef<google.maps.Map | null>(null);
  const techMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const customerMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const [progress, setProgress] = useState(0.1);
  const [eta, setEta] = useState(18);
  const [status, setStatus] = useState<"en_route" | "nearby" | "arrived">("en_route");

  const { data: booking } = trpc.bookings.getById.useQuery({ id }, { enabled: !!id });
  const technicianId = booking?.technicianId ?? 0;
  const { data: tech } = trpc.technicians.getById.useQuery(
    { id: technicianId },
    { enabled: !!technicianId }
  );

  // Simulate technician approach
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 0.02, 1);
        setEta(Math.max(0, Math.round(18 * (1 - next))));
        if (next > 0.85) setStatus("nearby");
        if (next >= 1) { setStatus("arrived"); clearInterval(interval); }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Customer location (booking address or default)
  const customerLoc = DEFAULT_CENTER;
  // Technician start location (slightly offset from Patan center)
  const techStart = { lat: 23.8200, lng: 72.0900 };

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // Customer marker
    const custEl = document.createElement("div");
    custEl.innerHTML = `
      <div style="background:#3b82f6;color:white;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(59,130,246,0.5);border:3px solid white;">🏠</div>
    `;
    customerMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: customerLoc,
      title: "Your Location",
      content: custEl,
    });

    // Technician marker
    const techEl = document.createElement("div");
    techEl.innerHTML = `
      <div style="background:linear-gradient(135deg,#1e3a5f,#0891b2);color:white;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:3px solid white;animation:pulse 2s infinite;">🔧</div>
    `;
    techMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: techStart,
      title: "Technician",
      content: techEl,
    });

    // Draw route
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#0891b2", strokeWeight: 4, strokeOpacity: 0.7 },
    });
    directionsRendererRef.current = directionsRenderer;

    directionsService.route(
      { origin: techStart, destination: customerLoc, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === "OK" && result) directionsRenderer.setDirections(result);
      }
    );

    // Fit bounds
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(customerLoc);
    bounds.extend(techStart);
    map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
  }, []);

  // Update technician marker position as progress changes
  useEffect(() => {
    if (!techMarkerRef.current) return;
    const newPos = simulateMovement(techStart, customerLoc, progress);
    techMarkerRef.current.position = newPos;
    if (mapRef.current && progress > 0.5) {
      mapRef.current.panTo(newPos);
    }
  }, [progress]);

  const statusConfig = {
    en_route: { label: "Technician En Route", color: "bg-blue-100 text-blue-700", icon: Navigation },
    nearby: { label: "Technician Nearby!", color: "bg-amber-100 text-amber-700", icon: Zap },
    arrived: { label: "Technician Arrived!", color: "bg-green-100 text-green-700", icon: CheckCircle },
  };
  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container py-6 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/booking-confirmation/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Live Technician Tracking
            </h1>
            <p className="text-sm text-muted-foreground">Booking #{id}</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${currentStatus.color}`}>
          <currentStatus.icon className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold">{currentStatus.label}</p>
            {status !== "arrived" && <p className="text-sm opacity-80">ETA: {eta} minutes</p>}
          </div>
          {status !== "arrived" && (
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>{eta} min</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-md">
              <div className="p-3 border-b bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Live Location</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><div className="text-base">🔧</div> Technician</div>
                  <div className="flex items-center gap-1"><div className="text-base">🏠</div> Your Location</div>
                </div>
              </div>
              <MapView
                className="h-[450px]"
                initialCenter={DEFAULT_CENTER}
                initialZoom={13}
                onMapReady={handleMapReady}
              />
              {/* Progress bar */}
              <div className="p-3 bg-white border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Technician's journey</span>
                  <span>{Math.round(progress * 100)}% of route completed</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-brand rounded-full transition-all duration-1000"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Technician Card */}
          <div className="lg:col-span-1 space-y-4">
            {tech && (
              <Card className="border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={tech.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name}`}
                        alt={tech.name}
                        className="w-16 h-16 rounded-2xl object-cover bg-muted"
                      />
                      {tech.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{tech.name}</h3>
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      </div>
                      <StarRating rating={parseFloat(tech.rating ?? "4.8")} reviewCount={tech.reviewCount ?? 0} size="sm" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {tech.yearsExperience} yrs exp · {tech.completedJobs?.toLocaleString()} jobs
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button className="flex-1 gap-1.5 gradient-brand text-white border-0" size="sm">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </Button>
                    <Button variant="outline" className="flex-1 gap-1.5" size="sm">
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>En route to your location</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>ETA: <strong className="text-foreground">{eta === 0 ? "Arrived" : `${eta} minutes`}</strong></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Info */}
            {booking && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-3">Service Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">AC Service #{booking.serviceId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground truncate">{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">₹{parseFloat(booking.totalAmount).toLocaleString("en-IN")} paid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safety */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800 text-sm">Safety Assured</span>
                </div>
                <p className="text-xs text-green-700">Your technician is background-verified and trained. Share your live location with family for safety.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
