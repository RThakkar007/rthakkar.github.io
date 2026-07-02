import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Snowflake, Menu, X, Bell, User, LogOut, LayoutDashboard, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_LINKS = [
  { href: "/", labelKey: "nav_home" },
  { href: "/services", labelKey: "nav_services" },
  { href: "/book", labelKey: "nav_book" },
  { href: "/about", labelKey: "nav_about" },
  { href: "/contact", labelKey: "nav_contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  const { data: myNotifs } = trpc.notifications.myNotifications.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
  const unreadCount = (myNotifs as any[])?.filter((n: any) => !n.isRead).length ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b border-border/50"
      }`}>
        <div className="container flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Arctic<span className="text-primary">AC</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                } ${l.labelKey === "nav_book" ? "!text-primary font-semibold" : ""}`}
              >
                {t[l.labelKey as keyof typeof t]}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle compact />
            {isAuthenticated ? (
              <>
                <Link href="/my-bookings" className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="p-2 rounded-lg hover:bg-muted/50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center" title="Admin Dashboard">
                    <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 text-sm max-w-[140px]">
                  <User className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-1 text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href={getLoginUrl()}>Login</a>
                </Button>
                <Button size="sm" className="btn-glow" asChild>
                  <a href={getLoginUrl()}>Get Started</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: bell + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            {isAuthenticated && (
              <Link href="/my-bookings" className="relative p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[280px] bg-background border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Snowflake className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Arctic<span className="text-primary">AC</span>
                </span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-muted/50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            {isAuthenticated && (
              <div className="px-4 py-3 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
                    isActive(l.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  {t[l.labelKey as keyof typeof t]}
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link href="/my-bookings"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 min-h-[48px]"
                  >
                    {t.nav_my_bookings}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 min-h-[48px]"
                    >
                      <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> {t.nav_admin}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Bottom actions */}
            {/* Language & Theme in drawer */}
            <div className="px-3 py-2 border-t border-border flex-shrink-0">
              <LanguageSwitcher inline />
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-foreground">Dark Mode</span>
                <ThemeToggle />
              </div>
            </div>
            <div className="px-4 pb-4 border-t border-border space-y-2 flex-shrink-0">
              {isAuthenticated ? (
                <Button variant="outline" className="w-full gap-2 min-h-[48px]" onClick={() => { logout(); setMenuOpen(false); }}>
                  <LogOut className="w-4 h-4" /> {t.nav_logout}
                </Button>
              ) : (
                <>
                  <Button asChild className="w-full btn-glow min-h-[48px]">
                    <a href={getLoginUrl()}>{t.nav_get_started}</a>
                  </Button>
                  <Button asChild variant="outline" className="w-full min-h-[48px]">
                    <a href={getLoginUrl()}>{t.nav_login}</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
