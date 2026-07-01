import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  User, Mail, Phone, MapPin, Shield, LogOut, Edit2, Save,
  BookOpen, Star, Settings, ChevronRight, Snowflake
} from "lucide-react";

export default function Account() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => { toast.success("Profile updated!"); setIsEditing(false); },
    onError: () => toast.error("Failed to update profile. Please try again."),
  });

  const handleSaveProfile = () => {
    updateProfile.mutate({
      name: form.name || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
    });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground mb-6">Access your bookings, profile, and more.</p>
          <Button className="gradient-brand text-white border-0 btn-scale px-8" asChild>
            <a href={getLoginUrl()}>Sign In / Sign Up</a>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero text-white py-10">
        <div className="container">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white/30">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user?.name ?? "User"}</h1>
              <p className="text-white/70">{user?.email}</p>
              <Badge className="mt-1 bg-white/10 text-white border-white/20 capitalize">{user?.role ?? "user"}</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 bg-slate-50 py-8">
        <div className="container max-w-3xl">
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" /> Profile Information
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsEditing(!isEditing);
                    if (!isEditing) setForm({ name: user?.name ?? "", phone: "", address: "" });
                  }} className="gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1" placeholder={user?.name ?? "Your name"} />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" placeholder="10-digit number" />
                    </div>
                    <div>
                      <Label>Default Address</Label>
                      <Input value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} className="mt-1" placeholder="Your home address" />
                    </div>
                    <Button className="gradient-brand text-white border-0 gap-2" onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                      <Save className="w-4 h-4" /> Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { icon: User, label: "Name", value: user?.name ?? "—" },
                      { icon: Mail, label: "Email", value: user?.email ?? "—" },
                      { icon: Phone, label: "Phone", value: "Not set" },
                      { icon: MapPin, label: "Address", value: "Not set" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-foreground mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { icon: BookOpen, label: "My Bookings", desc: "View all your AC service bookings", href: "/bookings" },
                    { icon: Snowflake, label: "Book a Service", desc: "Schedule a new AC service", href: "/services" },
                    { icon: Star, label: "Find Technicians", desc: "Locate nearby AC experts", href: "/locate" },
                    { icon: Shield, label: "Safety & Privacy", desc: "Manage your data and preferences", href: "#" },
                  ].map((item) => (
                    <Link key={item.label} href={item.href}>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card className="border-red-200">
              <CardContent className="p-6">
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 gap-2"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
