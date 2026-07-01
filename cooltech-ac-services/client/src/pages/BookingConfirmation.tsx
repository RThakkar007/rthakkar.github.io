import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle, Calendar, Clock, MapPin, Phone, MessageSquare,
  Navigation, Snowflake, ArrowRight, User, Shield
} from "lucide-react";

export default function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const id = parseInt(bookingId ?? "0");

  const { data: booking, isLoading } = trpc.bookings.getById.useQuery({ id }, { enabled: !!id });

  // Load the technician assigned to this specific booking
  const technicianId = booking?.technicianId ?? 0;
  const { data: assignedTech } = trpc.technicians.getById.useQuery(
    { id: technicianId },
    { enabled: !!technicianId }
  );

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-slate-50 py-10">
        <div className="container max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your AC service has been booked successfully. Booking ID: <strong>#{id}</strong>
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="font-bold text-foreground mb-4">Booking Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Snowflake className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="font-medium text-sm">AC Service #{booking.serviceId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Scheduled Date</p>
                      <p className="font-medium text-sm">{booking.scheduledDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time Slot</p>
                      <p className="font-medium text-sm">{booking.scheduledTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Service Address</p>
                      <p className="font-medium text-sm">{booking.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount Paid</p>
                      <p className="font-bold text-primary">₹{parseFloat(booking.totalAmount).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Technician */}
          {assignedTech && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="gradient-brand text-white border-0">Technician Assigned</Badge>
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={assignedTech.photoUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedTech.name}`}
                      alt={assignedTech.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-muted"
                    />
                    {assignedTech.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">{assignedTech.name}</h3>
                      {assignedTech.isVerified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                    </div>
                    <StarRating rating={parseFloat(assignedTech.rating ?? "4.8")} reviewCount={assignedTech.reviewCount ?? 0} size="sm" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {assignedTech.yearsExperience} years experience · {assignedTech.completedJobs?.toLocaleString()} jobs completed
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </Button>
                      <Link href={`/tracking/${id}`}>
                        <Button size="sm" className="gradient-brand text-white border-0 gap-1.5">
                          <Navigation className="w-3.5 h-3.5" /> Live Track
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Next */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-bold text-foreground mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                {[
                  { icon: User, title: "Technician Assigned", desc: "Your technician has been notified and will confirm shortly.", done: true },
                  { icon: Navigation, title: "Technician En Route", desc: "You'll get a notification when your technician is on the way.", done: false },
                  { icon: Snowflake, title: "Service in Progress", desc: "Your AC service will be performed at the scheduled time.", done: false },
                  { icon: CheckCircle, title: "Job Completed", desc: "Rate your experience and leave a review.", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-green-100" : "bg-muted"}`}>
                      <item.icon className={`w-4 h-4 ${item.done ? "text-green-600" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/tracking/${id}`} className="flex-1">
              <Button className="w-full gradient-brand text-white border-0 gap-2">
                <Navigation className="w-4 h-4" /> Track Technician Live
              </Button>
            </Link>
            <Link href="/bookings" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                My Bookings <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
