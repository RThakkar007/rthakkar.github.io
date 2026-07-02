import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  CheckCircle2, Clock, MapPin, CreditCard, ChevronRight,
  Calendar, Snowflake, ArrowLeft, User, Phone, Home, Loader2
} from "lucide-react";

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
];

const SESSION_KEY = "cooltech_cart_session";
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

function getNextDays(n: number) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

const STEPS = ["Service", "Schedule", "Address", "Payment"];

export default function Booking() {
  const { serviceId } = useParams<{ serviceId?: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(serviceId ? parseInt(serviceId) : null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState({ street: "", city: "Patan, Gujarat", pincode: "", notes: "" });
  const [customerInfo, setCustomerInfo] = useState({ name: user?.name ?? "", phone: "" });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const { data: services } = trpc.services.list.useQuery();
  const { data: selectedService } = trpc.services.getById.useQuery(
    { id: selectedServiceId ?? 0 },
    { enabled: !!selectedServiceId }
  );

  const createBooking = trpc.bookings.create.useMutation();
  const createCheckoutSession = trpc.payments.createCheckoutSession.useMutation();
  const confirmPayment = trpc.bookings.confirmPayment.useMutation();

  const sessionId = getSessionId();
  const { data: cartItems } = trpc.cart.get.useQuery({ sessionId });
  const clearCart = trpc.cart.clear.useMutation();

  useEffect(() => {
    if (user?.name) setCustomerInfo(prev => ({ ...prev, name: user.name ?? "" }));
  }, [user]);

  const days = getNextDays(7);

  const totalAmount = selectedService
    ? parseFloat(selectedService.basePrice)
    : (cartItems ?? []).reduce((sum, item) => sum + parseFloat(item.service?.basePrice ?? "0") * item.quantity, 0);

  const canProceedStep0 = !!selectedServiceId || (cartItems?.length ?? 0) > 0;
  const canProceedStep1 = !!selectedDate && !!selectedTime;
  const canProceedStep2 = address.street.length > 5 && address.city && customerInfo.name && customerInfo.phone.length >= 10;

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your booking.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Create booking
      const serviceIdToBook = selectedServiceId ?? cartItems?.[0]?.serviceId;
      if (!serviceIdToBook) throw new Error("No service selected");

      const booking = await createBooking.mutateAsync({
        serviceId: serviceIdToBook,
        scheduledDate: selectedDate!.toISOString().split("T")[0],
        scheduledTime: selectedTime!,
        address: `${address.street}, ${address.city} - ${address.pincode}`,
        city: address.city,
        totalAmount: totalAmount.toString(),
        notes: address.notes,
      });

      setBookingId(booking.id);

      // Create Stripe Checkout session
      const serviceName = selectedService?.name ?? "AC Service";
      const session = await createCheckoutSession.mutateAsync({
        bookingId: booking.id,
        amount: Math.round(totalAmount * 100), // paise
        serviceName,
        currency: "inr",
      });

      if (session.checkoutUrl) {
        // Redirect to Stripe Checkout in a new tab
        toast.success("Redirecting to secure payment...");
        await clearCart.mutateAsync({ sessionId });
        window.open(session.checkoutUrl, "_blank");
        // Also navigate to confirmation page (payment webhook will confirm)
        navigate(`/booking-confirmation/${booking.id}`);
      } else {
        // Demo mode fallback (no Stripe key configured)
        await confirmPayment.mutateAsync({
          bookingId: booking.id,
          paymentIntentId: session.sessionId,
        });
        await clearCart.mutateAsync({ sessionId });
        toast.success("Booking confirmed! (Demo mode)");
        navigate(`/booking-confirmation/${booking.id}`);
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const formatDate = (d: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { day: days[d.getDay()], date: d.getDate(), month: months[d.getMonth()] };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero text-white py-8">
        <div className="container">
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Book AC Service</h1>
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  i === step ? "bg-white text-primary" : i < step ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>}
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-white/30" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1 bg-slate-50 py-8">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Step Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">

                  {/* Step 0: Service Selection */}
                  {step === 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Select Your Service</h2>
                      {selectedService && (
                        <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{selectedService.name}</p>
                              <p className="text-sm text-muted-foreground">₹{parseFloat(selectedService.basePrice).toLocaleString("en-IN")}</p>
                            </div>
                            <Badge className="gradient-brand text-white border-0">Selected</Badge>
                          </div>
                        </div>
                      )}
                      {!selectedServiceId && (
                        <div className="space-y-3">
                          {(services ?? []).map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setSelectedServiceId(s.id)}
                              className={`w-full text-left p-4 rounded-xl border transition-all ${
                                selectedServiceId === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{s.name}</p>
                                  <p className="text-sm text-muted-foreground">{s.durationMinutes} min</p>
                                </div>
                                <span className="font-bold text-primary">₹{parseFloat(s.basePrice).toLocaleString("en-IN")}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {cartItems && cartItems.length > 0 && !selectedServiceId && (
                        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                          <p className="text-sm font-medium text-amber-800 mb-2">Items in your cart:</p>
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.service?.name}</span>
                              <span className="font-medium">₹{parseFloat(item.service?.basePrice ?? "0").toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 1: Schedule */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Choose Date & Time</h2>
                      <div className="mb-6">
                        <p className="text-sm font-medium text-muted-foreground mb-3">Select Date</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {days.map((d, i) => {
                            const { day, date, month } = formatDate(d);
                            const isSelected = selectedDate?.toDateString() === d.toDateString();
                            return (
                              <button
                                key={i}
                                onClick={() => setSelectedDate(d)}
                                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border w-16 transition-all btn-scale ${
                                  isSelected ? "gradient-brand text-white border-transparent shadow-md" : "border-border hover:border-primary"
                                }`}
                              >
                                <span className={`text-xs font-medium ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>{day}</span>
                                <span className={`text-xl font-bold ${isSelected ? "text-white" : "text-foreground"}`}>{date}</span>
                                <span className={`text-xs ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>{month}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Select Time Slot</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`p-2.5 rounded-lg border text-sm font-medium transition-all btn-scale ${
                                selectedTime === slot ? "gradient-brand text-white border-transparent shadow-md" : "border-border hover:border-primary text-foreground"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Address */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Service Address</h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative mt-1">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input id="name" placeholder="Your name" value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({ ...p, name: e.target.value }))} className="pl-9" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative mt-1">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input id="phone" placeholder="10-digit number" value={customerInfo.phone} onChange={(e) => setCustomerInfo(p => ({ ...p, phone: e.target.value }))} className="pl-9" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <div className="relative mt-1">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input id="street" placeholder="House no., street, area" value={address.street} onChange={(e) => setAddress(p => ({ ...p, street: e.target.value }))} className="pl-9" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={address.city} onChange={(e) => setAddress(p => ({ ...p, city: e.target.value }))} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="pincode">PIN Code</Label>
                            <Input id="pincode" placeholder="110001" value={address.pincode} onChange={(e) => setAddress(p => ({ ...p, pincode: e.target.value }))} className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="notes">Additional Notes (optional)</Label>
                          <Textarea id="notes" placeholder="Landmark, floor, special instructions..." value={address.notes} onChange={(e) => setAddress(p => ({ ...p, notes: e.target.value }))} className="mt-1" rows={3} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment</h2>

                      {!isAuthenticated ? (
                        <div className="text-center py-8">
                          <Snowflake className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-4">Please sign in to complete your booking and payment.</p>
                          <Button className="gradient-brand text-white border-0" asChild>
                            <a href={getLoginUrl()}>Sign In to Continue</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                            <p className="text-sm font-medium text-blue-800 mb-1">Secure Payment via Stripe</p>
                            <p className="text-xs text-blue-600">Your payment is encrypted and secure. Use card 4242 4242 4242 4242 for testing.</p>
                          </div>

                          {/* Simulated card form */}
                          <div className="space-y-3">
                            <div>
                              <Label>Card Number</Label>
                              <Input placeholder="4242 4242 4242 4242" className="mt-1 font-mono" defaultValue="4242 4242 4242 4242" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Expiry</Label>
                                <Input placeholder="MM/YY" className="mt-1" defaultValue="12/28" />
                              </div>
                              <div>
                                <Label>CVV</Label>
                                <Input placeholder="123" className="mt-1" defaultValue="123" />
                              </div>
                            </div>
                            <div>
                              <Label>Name on Card</Label>
                              <Input placeholder="Your name" className="mt-1" defaultValue={customerInfo.name} />
                            </div>
                          </div>

                          <Button
                            className="w-full gradient-brand text-white border-0 btn-scale text-base py-5"
                            onClick={handlePayment}
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing Payment...</>
                            ) : (
                              <>Pay ₹{totalAmount.toLocaleString("en-IN")} & Confirm Booking</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/services")} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> {step === 0 ? "Back to Services" : "Previous"}
                    </Button>
                    {step < 3 && (
                      <Button
                        className="gradient-brand text-white border-0 btn-scale gap-2"
                        onClick={() => setStep(s => s + 1)}
                        disabled={
                          (step === 0 && !canProceedStep0) ||
                          (step === 1 && !canProceedStep1) ||
                          (step === 2 && !canProceedStep2)
                        }
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

                  {selectedService ? (
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{selectedService.name}</span>
                        <span className="font-medium">₹{parseFloat(selectedService.basePrice).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform fee</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                    </div>
                  ) : (cartItems ?? []).length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {cartItems?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate">{item.service?.name}</span>
                          <span className="font-medium ml-2">₹{parseFloat(item.service?.basePrice ?? "0").toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">No service selected yet.</p>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary text-lg">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                  )}

                  {address.street && (
                    <div className="mt-3 flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{address.street}, {address.city}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t space-y-2">
                    {["Transparent pricing", "Trained professional", "Service warranty"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
