import { useParams } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { CheckCircle, Clock, MapPin, ArrowRight } from "lucide-react";

export default function BookingConfirmation() {
  const { ref } = useParams<{ ref: string }>();
  const { data: booking } = trpc.bookings.getByRef.useQuery({ ref: ref ?? "" }, { enabled: !!ref });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6 arctic-glow-sm">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg mb-8">Your booking reference is:</p>
          <div className="text-3xl font-mono font-bold text-primary mb-8 tracking-widest">{ref}</div>

          {booking && (
            <Card className="glass-card mb-8 text-left">
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize font-medium text-primary">{booking.status.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span>{new Date(booking.scheduledAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-right max-w-xs">{booking.address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="capitalize">{booking.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="btn-glow" asChild>
              <Link href={`/track/${ref}`}>Track Booking <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
