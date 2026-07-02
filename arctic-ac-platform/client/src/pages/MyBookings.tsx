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

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  assigned: "bg-primary/10 text-primary",
  on_the_way: "bg-yellow-500/10 text-yellow-400",
  in_progress: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function MyBookings() {
  const { isAuthenticated, loading } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });

  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Sign in to view your bookings</h2>
            <Button className="btn-glow" asChild><a href={getLoginUrl()}>Login / Register</a></Button>
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
          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Bookings</h1>
          {isLoading ? (
            <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />)}</div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(b => (
                <Card key={b.id} className="glass-card hover:border-primary/30 transition-all">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-primary">{b.bookingRef}</span>
                        <Badge className={`text-xs ${STATUS_COLOR[b.status] ?? ""}`}>{b.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(b.scheduledAt).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">{b.address}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/track/${b.bookingRef}`}>Track <ArrowRight className="ml-1 w-3 h-3" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No bookings yet.</p>
              <Button className="btn-glow" asChild><Link href="/book">Book Your First Service</Link></Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
