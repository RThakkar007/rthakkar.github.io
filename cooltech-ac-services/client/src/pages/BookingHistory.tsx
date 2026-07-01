import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Calendar, Clock, MapPin, Navigation, Snowflake, ArrowRight,
  CheckCircle, Loader2, AlertCircle, BookOpen, Plus
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-700", icon: Loader2 },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function BookingHistory() {
  const { isAuthenticated, loading } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.list.useQuery(undefined, { enabled: isAuthenticated });

  if (loading || isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20">
        <BookOpen className="w-16 h-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to view bookings</h2>
          <p className="text-muted-foreground mb-6">Track all your AC service bookings in one place.</p>
          <Button className="gradient-brand text-white border-0 btn-scale px-8" asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero text-white py-10">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Bookings</h1>
              <p className="text-white/70">Track and manage all your AC service bookings</p>
            </div>
            <Link href="/services">
              <Button className="bg-white text-primary hover:bg-white/90 gap-2 btn-scale">
                <Plus className="w-4 h-4" /> New Booking
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex-1 bg-slate-50 py-8">
        <div className="container max-w-3xl">
          {(!bookings || bookings.length === 0) ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Snowflake className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-6">Book your first AC service and it will appear here.</p>
              <Link href="/services">
                <Button className="gradient-brand text-white border-0 btn-scale gap-2">
                  Browse Services <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
              {bookings.map((booking: any) => {
                const statusCfg = STATUS_CONFIG[booking.status ?? "pending"] ?? STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                const isActive = ["confirmed", "in_progress"].includes(booking.status ?? "");
                return (
                  <Card key={booking.id} className={`transition-all ${isActive ? "border-primary/30 shadow-md" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
                            <Snowflake className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-foreground">Booking #{booking.id}</p>
                              <Badge className={`${statusCfg.color} border-0 text-xs gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusCfg.label}
                              </Badge>
                              {isActive && <Badge className="bg-green-100 text-green-700 border-0 text-xs animate-pulse">Live</Badge>}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{booking.scheduledDate}</span>
                                <span>·</span>
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{booking.scheduledTime}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{booking.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary text-lg">₹{parseFloat(booking.totalAmount).toLocaleString("en-IN")}</p>
                          <p className="text-xs text-muted-foreground capitalize">{booking.paymentStatus ?? "pending"}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Link href={`/booking-confirmation/${booking.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                            View Details <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                        {isActive && (
                          <Link href={`/tracking/${booking.id}`} className="flex-1">
                            <Button size="sm" className="w-full gradient-brand text-white border-0 gap-1.5 text-xs">
                              <Navigation className="w-3 h-3" /> Track Live
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
