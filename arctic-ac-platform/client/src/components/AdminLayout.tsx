import { Link, useLocation } from "wouter";
import { Snowflake, LayoutDashboard, CalendarCheck, Users, Settings, MapPin, BarChart3, CreditCard, LogOut, Wrench, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
  { href: "/admin/technicians", icon: Users, label: "Technicians" },
  { href: "/admin/map", icon: MapPin, label: "Live Map" },
  { href: "/admin/services", icon: Wrench, label: "Services" },
  { href: "/admin/zones", icon: Settings, label: "Zones" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [loc] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [loc]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [loading, user]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Checking access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-5 border-b border-sidebar-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Snowflake className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ArcticAC</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer min-h-[44px] ${loc === item.href ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name ?? "Admin"}</div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-6 gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted/50 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="font-bold text-base sm:text-lg flex-1 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
