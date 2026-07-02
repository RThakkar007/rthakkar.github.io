import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, X, Snowflake, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/book", label: "Book Now" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Snowflake className="w-5 h-5 text-primary-foreground" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Arctic<span className="text-primary">AC</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${loc === l.href ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => logout()}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <a href={getLoginUrl()}>Login</a>
              </Button>
              <Button size="sm" className="btn-glow" asChild>
                <Link href="/book">Book Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`text-sm font-medium py-2 ${loc === l.href ? "text-primary" : "text-muted-foreground"}`}>
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex gap-2">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
            ) : (
              <Button size="sm" asChild><a href={getLoginUrl()}>Login / Register</a></Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
