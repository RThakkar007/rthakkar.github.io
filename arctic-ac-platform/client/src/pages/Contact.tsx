import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.contact_success);
    setForm({ name: "", email: "", phone: "", message: "" });
  };
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
                {[
                  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                  { icon: Mail, label: "Email", value: "support@arcticac.in" },
                  { icon: MapPin, label: "Address", value: "Ahmedabad, Gujarat, India" },
                  { icon: Clock, label: "Hours", value: "24/7 — Emergency services available" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div><div className="text-sm text-muted-foreground">{item.label}</div><div className="font-medium">{item.value}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="glass-card">
              <CardContent className="p-5 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label>{t.contact_name}</Label><Input className="mt-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                  <div><Label>{t.contact_email_label}</Label><Input type="email" className="mt-1" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
                  <div><Label>{t.contact_phone_label}</Label><Input className="mt-1" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                  <div><Label>{t.contact_message}</Label><Textarea className="mt-1" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required /></div>
                  <Button type="submit" className="w-full btn-glow min-h-[48px]">{t.contact_send}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
