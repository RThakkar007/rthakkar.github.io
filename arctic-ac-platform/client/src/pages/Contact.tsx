import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type FormFields = { name: string; email: string; phone: string; message: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validatePhone(phone: string) {
  return phone === "" || /^[+\d\s\-()\u0900-\u097F]{7,15}$/.test(phone.trim());
}

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormFields>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (fields: FormFields): FormErrors => {
    const e: FormErrors = {};
    if (!fields.name.trim()) e.name = "Name is required.";
    else if (fields.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!fields.email.trim()) e.email = "Email is required.";
    else if (!validateEmail(fields.email)) e.email = "Please enter a valid email address.";
    if (!validatePhone(fields.phone)) e.phone = "Please enter a valid phone number (7–15 digits).";
    if (!fields.message.trim()) e.message = "Message is required.";
    else if (fields.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleBlur = (field: keyof FormFields) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validate(form);
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleChange = (field: keyof FormFields, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      const fieldErrors = validate(updated);
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    toast.success(t.contact_success);
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setTouched({});
    setTimeout(() => setSubmitted(false), 6000);
  };

  const FieldError = ({ field }: { field: keyof FormFields }) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-xs text-destructive flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-5xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">{t.contact_title}</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.contact_title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12">{t.contact_subtitle}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
                  <div><div className="text-sm text-muted-foreground">Phone</div><a href="tel:+919904089393" className="font-medium hover:text-primary transition-colors">+91 9904089393</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                  <div><div className="text-sm text-muted-foreground">Email</div><a href="mailto:info.ronakenterprise@gmail.com" className="font-medium hover:text-primary transition-colors">info.ronakenterprise@gmail.com</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div><div className="text-sm text-muted-foreground">Address</div><a href="https://maps.google.com/?q=Patan,Gujarat,India" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">HO: Patan, Gujarat 384 265.</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-primary" /></div>
                  <div><div className="text-sm text-muted-foreground">Hours</div><div className="font-medium">24/7 — Emergency services available</div></div>
                </div>
              </div>
            </div>
            <Card className="glass-card">
              <CardContent className="p-5 sm:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
                    <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
                    <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <Label htmlFor="c-name">{t.contact_name} <span className="text-destructive">*</span></Label>
                      <Input
                        id="c-name"
                        className={`mt-1 ${touched.name && errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        autoComplete="name"
                        placeholder="Your full name"
                      />
                      <FieldError field="name" />
                    </div>
                    <div>
                      <Label htmlFor="c-email">{t.contact_email_label} <span className="text-destructive">*</span></Label>
                      <Input
                        id="c-email"
                        type="email"
                        className={`mt-1 ${touched.email && errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                      <FieldError field="email" />
                    </div>
                    <div>
                      <Label htmlFor="c-phone">{t.contact_phone_label}</Label>
                      <Input
                        id="c-phone"
                        type="tel"
                        className={`mt-1 ${touched.phone && errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        value={form.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        autoComplete="tel"
                        placeholder="+91 99040 89393"
                      />
                      <FieldError field="phone" />
                    </div>
                    <div>
                      <Label htmlFor="c-message">{t.contact_message} <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="c-message"
                        className={`mt-1 ${touched.message && errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        rows={5}
                        value={form.message}
                        onChange={e => handleChange("message", e.target.value)}
                        onBlur={() => handleBlur("message")}
                        placeholder="Describe your issue or question..."
                      />
                      <FieldError field="message" />
                    </div>
                    <Button type="submit" className="w-full btn-glow min-h-[48px]" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : t.contact_send}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
