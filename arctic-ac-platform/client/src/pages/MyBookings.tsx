import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { ArrowRight, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  assigned: "bg-primary/10 text-primary",
  on_the_way: "bg-yellow-500/10 text-yellow-400",
  in_progress: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function MyBookings() {
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });

  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">{t.mybookings_title}</h2>
            <Button className="btn-glow" asChild><a href={getLoginUrl()}>{t.login_submit} / {t.register_submit}</a></Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.mybookings_title}</h1>
          {isLoading ? (
            <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />)}</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(b => (
                <Card key={b.id} className="glass-card hover:border-primary/30 transition-all">
                 <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-primary text-sm">{b.bookingRef}</span>
                        <Badge className={`text-xs ${STATUS_COLOR[b.status] ?? ""}`}>{b.status === 'pending' ? t.mybookings_status_pending : b.status === 'assigned' ? t.mybookings_status_assigned : b.status === 'on_the_way' ? t.mybookings_status_on_way : b.status === 'completed' ? t.mybookings_status_completed : b.status === 'cancelled' ? t.mybookings_status_cancelled : b.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{new Date(b.scheduledAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{b.address}</p>
                    </div>
                    <Button size="sm" variant="outline" className="flex-shrink-0 min-h-[40px]" asChild>
                      <Link href={`/track/${b.bookingRef}`}>{t.mybookings_track} <ArrowRight className="ml-1 w-3 h-3" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">{t.mybookings_no_bookings}</p>
              <Button className="btn-glow" asChild><Link href="/book">{t.mybookings_book_first}</Link></Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
