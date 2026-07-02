import { useState } from "react";
import { useParams } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Clock, MapPin, User, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STATUS_STEPS = [
  { key: "pending", label: "Booking Placed", icon: Clock },
  { key: "assigned", label: "Assigned", icon: User },
  { key: "on_the_way", label: "On the Way", icon: MapPin },
  { key: "completed", label: "Completed", icon: CheckCircle },
];

export default function TrackBooking() {
  const { t } = useLanguage();
  const { ref: paramRef } = useParams<{ ref: string }>();
  const [searchRef, setSearchRef] = useState(paramRef === "search" ? "" : (paramRef ?? ""));
  const [queryRef, setQueryRef] = useState(paramRef && paramRef !== "search" ? paramRef : "");

  const { data: booking, isLoading, refetch } = trpc.bookings.getByRef.useQuery(
    { ref: queryRef },
    { enabled: !!queryRef, refetchInterval: 15000 }
  );

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === booking?.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.track_status}</h1>
          <p className="text-muted-foreground text-center mb-6 sm:mb-8 text-sm sm:text-base px-2">{t.track_not_found}</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10 px-0">
            <Input placeholder="Enter booking ref (e.g. ACXXXXXXXX)" value={searchRef}
              onChange={e => setSearchRef(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && setQueryRef(searchRef)}
              className="min-h-[48px] text-base" />
            <Button className="btn-glow min-h-[48px] sm:flex-shrink-0 px-6" onClick={() => setQueryRef(searchRef)}>Track</Button>
          </div>

          {isLoading && <div className="text-center text-muted-foreground">Loading...</div>}

          {booking && (
            <div className="space-y-6">
              {/* Status stepper */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="font-semibold mb-6">{t.track_status}</h2>
                  <div className="flex flex-col gap-0">
                    {STATUS_STEPS.map((s, i) => {
                      const done = i <= activeIndex;
                      const active = i === activeIndex;
                      return (
                        <div key={s.key} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-primary border-primary" : "bg-muted border-border"} ${active ? "arctic-glow-sm" : ""}`}>
                              <s.icon className={`w-5 h-5 ${done ? "text-primary-foreground" : "text-muted-foreground"}`} />
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`w-0.5 h-10 ${i < activeIndex ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                          <div className="pt-2 pb-8">
                            <p className={`font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                            {active && booking.updates && booking.updates.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(booking.updates[booking.updates.length - 1].createdAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Booking details */}
              <Card className="glass-card">
                <CardContent className="p-6 space-y-3">
                  <h2 className="font-semibold mb-2">{t.booking_ref_number}</h2>
                  <div className="flex justify-between items-start gap-2 text-sm"><span className="text-muted-foreground flex-shrink-0">{t.booking_ref_number}</span><span className="font-mono font-bold text-primary text-right">{booking.bookingRef}</span></div>
                  <div className="flex justify-between items-start gap-2 text-sm"><span className="text-muted-foreground flex-shrink-0">{t.track_scheduled}</span><span className="text-right text-xs sm:text-sm">{new Date(booking.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></div>
                  <div className="flex justify-between items-start gap-2 text-sm"><span className="text-muted-foreground flex-shrink-0">{t.track_address}</span><span className="text-right text-xs sm:text-sm leading-relaxed max-w-[60%]">{booking.address}</span></div>
                  <div className="flex justify-between items-start gap-2 text-sm"><span className="text-muted-foreground flex-shrink-0">Payment</span><span className="capitalize">{booking.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}</span></div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
