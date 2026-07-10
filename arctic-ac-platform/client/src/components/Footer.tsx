import { Link } from "wouter";
import { Snowflake, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Arctic<span className="text-primary">AC</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Professional AC repair, installation, and maintenance services. Available 24/7 with real-time technician tracking.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" /> +91 99040 89393
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" /> info.ronakenterprise@gmail.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" /> Patan, Gujarat 384 265
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">{t.nav_services}</h4>
            <div className="flex flex-col gap-2">
              {["AC Installation", "AC Repair", "AC Service", "Deep Cleaning", "Gas Refill", "AMC Plans"].map(s => (
                <Link key={s} href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">{s}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">{t.footer_quick_links}</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cancellation Policy", href: "/cancellation" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ArcticAC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
