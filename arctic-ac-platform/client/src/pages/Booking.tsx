import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { CheckCircle, Calendar, CreditCard, User, Snowflake, ChevronRight } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import DateTimePicker from "@/components/DateTimePicker";

const STEPS = ["Service", "Schedule", "Details", "Payment"];

const DEMO_SERVICES = [
  { id: 1, name: "AC Installation", price: "999", duration: 120, icon: "🔧" },
  { id: 2, name: "AC Repair", price: "499", duration: 60, icon: "⚙️" },
  { id: 3, name: "AC Service & Cleaning", price: "349", duration: 90, icon: "🧹" },
  { id: 4, name: "Gas Refill", price: "1299", duration: 45, icon: "💨" },
  { id: 5, name: "PCB Repair", price: "799", duration: 60, icon: "🔌" },
  { id: 6, name: "AMC Plan", price: "1999", duration: 90, icon: "📋" },
];

export default function Booking() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll to top of card on every step change
  const goToStep = (n: number) => {
    setStep(n);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: (cardRef.current?.offsetTop ?? 0) - 80, behavior: "smooth" });
    }, 50);
  };

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
  const canProceedStep1 = form.scheduledAt && form.address && form.address.trim().length >= 5;

  const handleSubmit = () => {
    if (!form.serviceId || !form.scheduledAt || !form.address || form.address.trim().length < 5) {
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
      <div className="pt-20 pb-20">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6 text-center pt-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Book a Service
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Get a certified technician at your door today.
            </p>
          </div>

          {/* Step indicator — scrollable on mobile */}
          <div className="flex items-center justify-center mb-6 gap-1 sm:gap-2 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : i + 1}
                </div>
                <span className={`text-xs sm:text-sm font-medium hidden xs:block ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className={`w-4 sm:w-8 h-px flex-shrink-0 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <Card ref={cardRef} className="glass-card scroll-mt-24">
            <CardContent className="p-5 sm:p-8">

              {/* ── Step 0: Service Selection ── */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
                    <Snowflake className="w-5 h-5 text-primary" /> Select a Service
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayServices.map((s: any) => (
                      <button
                        key={s.id}
                        onClick={() => setForm(f => ({ ...f, serviceId: s.id }))}
                        className={`p-4 rounded-xl border text-left transition-all active:scale-[0.98] min-h-[72px] ${
                          form.serviceId === s.id
                            ? "border-primary bg-primary/10 shadow-[0_0_0_1px] shadow-primary/30"
                            : "border-border hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{(s as any).icon ?? "🔧"}</span>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{s.name}</div>
                            <div className="text-primary font-bold text-sm">₹{s.price}</div>
                          </div>
                          {form.serviceId === s.id && (
                            <CheckCircle className="w-4 h-4 text-primary ml-auto flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button
                    className="mt-6 w-full btn-glow min-h-[48px] text-base gap-2"
                    disabled={!form.serviceId}
                    onClick={() => goToStep(1)}
                  >
                    Continue to Schedule <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* ── Step 1: Schedule ── */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Date, Time & Address
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Preferred Date & Time *</Label>
                      <DateTimePicker
                        value={form.scheduledAt}
                        onChange={val => setForm(f => ({ ...f, scheduledAt: val }))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Service Address *</Label>
                      <AddressAutocomplete
                        value={form.address}
                        onChange={addr => setForm(f => ({ ...f, address: addr }))}
                        error={!!(form.address && form.address.trim().length < 5)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Additional Notes</Label>
                      <Textarea
                        placeholder="Any specific issues or instructions for the technician..."
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="min-h-[48px] px-5" onClick={() => goToStep(0)}>Back</Button>
                    <Button
                      className="flex-1 btn-glow min-h-[48px] text-base gap-2"
                      disabled={!canProceedStep1}
                      onClick={() => goToStep(2)}
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Customer Details ── */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Your Details
                  </h2>
                  {isAuthenticated ? (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user?.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                        Booking as guest.{" "}
                        <a href="/register" className="text-primary hover:underline font-medium">Create an account</a>{" "}
                        to track your booking easily.
                      </div>
                      <div>
                        <Label className="text-sm">Full Name *</Label>
                        <Input className="mt-1 min-h-[44px]" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} />
                      </div>
                      <div>
                        <Label className="text-sm">Email *</Label>
                        <Input type="email" className="mt-1 min-h-[44px]" value={form.guestEmail} onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))} />
                      </div>
                      <div>
                        <Label className="text-sm">Phone *</Label>
                        <Input type="tel" className="mt-1 min-h-[44px]" value={form.guestPhone} onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))} />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="min-h-[48px] px-5" onClick={() => goToStep(1)}>Back</Button>
                    <Button className="flex-1 btn-glow min-h-[48px] text-base gap-2" onClick={() => goToStep(3)}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Payment ── */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { value: "cod", label: "Cash on Delivery", desc: "Pay in cash when the technician arrives.", icon: "💵" },
                      { value: "razorpay", label: "Razorpay (Online)", desc: "Pay securely via UPI, card, or net banking.", icon: "💳" },
                    ].map(pm => (
                      <button
                        key={pm.value}
                        onClick={() => setForm(f => ({ ...f, paymentMethod: pm.value as "cod" | "razorpay" }))}
                        className={`w-full p-4 rounded-xl border text-left transition-all active:scale-[0.98] min-h-[72px] ${
                          form.paymentMethod === pm.value
                            ? "border-primary bg-primary/10 shadow-[0_0_0_1px] shadow-primary/30"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{pm.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-sm sm:text-base">{pm.label}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{pm.desc}</div>
                          </div>
                          {form.paymentMethod === pm.value && (
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border mb-6">
                    <h3 className="font-semibold mb-3 text-sm sm:text-base">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Service</span>
                        <span className="text-right font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Date & Time</span>
                        <span className="text-right text-xs sm:text-sm">
                          {form.scheduledAt ? new Date(form.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Address</span>
                        <span className="text-right text-xs leading-relaxed max-w-[60%]">{form.address}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{selectedService?.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="min-h-[48px] px-5" onClick={() => goToStep(2)}>Back</Button>
                    <Button
                      className="flex-1 btn-glow min-h-[48px] text-base"
                      onClick={handleSubmit}
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? "Confirming..." : "Confirm Booking ✓"}
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
