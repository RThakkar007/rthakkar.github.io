import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Snowflake, Menu, MapPin, Phone, ShoppingCart, X, User, BookOpen, LogOut, ChevronDown } from "lucide-react";

const SESSION_KEY = "cooltech_cart_session";
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sessionId = getSessionId();
  const { data: cartItems } = trpc.cart.get.useQuery({ sessionId }, { refetchInterval: 5000 });
  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const navLinks = [
    { href: "/services", label: "AC Services" },
    { href: "/technicians", label: "Find Technician" },
  ];

  const isActive = (href: string) => location === href || location.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Snowflake className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                CoolTech
              </span>
              <span className="text-xs text-muted-foreground block -mt-1 leading-none">AC Services</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${isActive(link.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/book">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] gradient-brand text-white border-0">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-xs gradient-brand text-white">
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">{user?.name ?? "Account"}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings" className="flex items-center gap-2 cursor-pointer">
                      <BookOpen className="w-4 h-4" /> My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" className="gradient-brand text-white border-0 btn-scale hidden sm:flex" asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="gradient-hero p-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Snowflake className="w-6 h-6" />
                    <span className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CoolTech</span>
                  </div>
                  <p className="text-white/70 text-sm">AC Services Platform</p>
                </div>
                <div className="p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className={`w-full justify-start text-base ${isActive(link.href) ? "text-primary bg-primary/10" : ""}`}>
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-base"><User className="w-4 h-4 mr-2" /> My Profile</Button>
                      </Link>
                      <Link href="/bookings" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-base"><BookOpen className="w-4 h-4 mr-2" /> My Bookings</Button>
                      </Link>
                      <Button variant="ghost" onClick={logout} className="w-full justify-start text-base text-destructive">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full gradient-brand text-white border-0 mt-4" asChild>
                      <a href={getLoginUrl()}>Sign In / Register</a>
                    </Button>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>1800-123-4567</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
