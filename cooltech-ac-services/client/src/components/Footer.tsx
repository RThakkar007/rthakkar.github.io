import { Link } from "wouter";
import { Snowflake, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CoolTech</span>
                <p className="text-xs text-slate-400 -mt-1">AC Services</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Expert AC services at your doorstep. Transparent pricing, trained professionals, and 100% quality guaranteed.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">AC Services</h3>
            <ul className="space-y-2 text-sm">
              {["Foam-jet cleaning", "AC Repair", "Gas Refill & Check-up", "AC Installation", "AC Uninstallation"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/technicians" className="hover:text-white transition-colors">Find Technician</Link></li>
              <li><Link href="/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>1800-123-4567 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>support@cooltech.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>Serving Delhi NCR, Mumbai, Bangalore, Chennai & 50+ cities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2025 CoolTech AC Services. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
