import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { CheckCircle, MapPin, Calendar, CreditCard, User, Snowflake } from "lucide-react";

const STEPS = ["Service", "Schedule", "Details", "Payment"];

const DEMO_SERVICES = [
  { id: 1, name: "AC Installation", price: "999", duration: 120 },
  { id: 2, name: "AC Repair", price: "499", duration: 60 },
  { id: 3, name: "AC Service & Cleaning", price: "349", duration: 90 },
  { id: 4, name: "Gas Refill", price: "1299", duration: 45 },
  { id: 5, name: "PCB Repair", price: "799", duration: 60 },
  { id: 6, name: "AMC Plan", price: "1999", duration: 90 },
];

export default function Booking() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    serviceId: 0,
    scheduledAt: "",
    address: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "razorpay",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });

  const { data: services } = trpc.services.list.useQuery();
  const displayServices = services && services.length > 0 ? services : DEMO_SERVICES;
  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: (data) => {
      toast.success("Booking confirmed!");
      navigate(`/booking/confirmation/${data.bookingRef}`);
    },
    onError: (e) => toast.error(e.message),
  });

  const selectedService = displayServices.find(s => s.id === form.serviceId);

  const handleSubmit = () => {
    if (!form.serviceId || !form.scheduledAt || !form.address) {
      toast.error("Please fill in all required fields.");
      return;
    }
    createBooking.mutate({
      serviceId: form.serviceId,
      scheduledAt: form.scheduledAt,
      address: form.address,
      notes: form.notes,
      paymentMethod: form.paymentMethod,
      ...(!isAuthenticated && {
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Book a Service</h1>
            <p className="text-muted-foreground">Get a certified technician at your door today.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10 gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <Card className="glass-card">
            <CardContent className="p-8">
              {/* Step 0: Service selection */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Snowflake className="text-primary" /> Select a Service</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayServices.map(s => (
                      <button key={s.id} onClick={() => setForm(f => ({ ...f, serviceId: s.id }))}
                        className={`p-4 rounded-xl border text-left transition-all ${form.serviceId === s.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-primary font-bold mt-1">₹{s.price}</div>
                      </button>
                    ))}
                  </div>
                  <Button className="mt-8 w-full btn-glow" disabled={!form.serviceId} onClick={() => setStep(1)}>
                    Continue to Schedule
                  </Button>
                </div>
              )}

              {/* Step 1: Schedule */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Calendar className="text-primary" /> Choose Date & Time</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Preferred Date & Time *</Label>
                      <Input type="datetime-local" className="mt-1" value={form.scheduledAt}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Service Address *</Label>
                      <Textarea className="mt-1" placeholder="Full address with flat no., building, area, city..."
                        value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Additional Notes</Label>
                      <Textarea className="mt-1" placeholder="Any specific issues or instructions..."
                        value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                    <Button className="flex-1 btn-glow" disabled={!form.scheduledAt || !form.address} onClick={() => setStep(2)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 2: Customer details (guest only) */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><User className="text-primary" /> Your Details</h2>
                  {isAuthenticated ? (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
                      <p className="text-sm text-muted-foreground">Booking as <span className="text-foreground font-medium">{user?.name}</span></p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                        Booking as guest. <a href="/register" className="text-primary hover:underline">Create an account</a> to track your booking easily.
                      </div>
                      <div><Label>Full Name *</Label><Input className="mt-1" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} /></div>
                      <div><Label>Email *</Label><Input type="email" className="mt-1" value={form.guestEmail} onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))} /></div>
                      <div><Label>Phone *</Label><Input className="mt-1" value={form.guestPhone} onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))} /></div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-8">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1 btn-glow" onClick={() => setStep(3)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><CreditCard className="text-primary" /> Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { value: "cod", label: "Cash on Delivery", desc: "Pay in cash when the technician arrives." },
                      { value: "razorpay", label: "Razorpay (Online)", desc: "Pay securely via UPI, card, or net banking." },
                    ].map(pm => (
                      <button key={pm.value} onClick={() => setForm(f => ({ ...f, paymentMethod: pm.value as "cod" | "razorpay" }))}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${form.paymentMethod === pm.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                        <div className="font-semibold">{pm.label}</div>
                        <div className="text-sm text-muted-foreground">{pm.desc}</div>
                      </button>
                    ))}
                  </div>
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border mb-6">
                    <h3 className="font-semibold mb-3">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span>{selectedService?.name}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Date & Time</span><span>{form.scheduledAt ? new Date(form.scheduledAt).toLocaleString() : "-"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="text-right max-w-48 truncate">{form.address}</span></div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                        <span>Total</span><span className="text-primary">₹{selectedService?.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button className="flex-1 btn-glow" onClick={handleSubmit} disabled={createBooking.isPending}>
                      {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
