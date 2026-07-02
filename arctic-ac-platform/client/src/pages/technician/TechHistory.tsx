import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, MapPin, CheckCircle } from "lucide-react";
import type { Booking } from "../../../../drizzle/schema";

export default function TechHistory() {
  const [, navigate] = useLocation();
  const techId = parseInt(localStorage.getItem("tech_id") ?? "0");

  const { data: jobs } = trpc.techJobs.myJobs.useQuery({ technicianId: techId }, { enabled: !!techId });
  const completedJobs = (jobs ?? []).filter((j: Booking) => j.status === "completed");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center h-16 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/tech/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">Job History</h1>
        </div>
      </header>
      <div className="container py-6 max-w-lg mx-auto">
        {completedJobs.length > 0 ? (
          <div className="space-y-3">
            {completedJobs.map((job: Booking) => (
              <Card key={job.id} className="glass-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-primary text-sm">{job.bookingRef}</span>
                    <Badge className="bg-green-500/10 text-green-400">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5" /> {new Date(job.scheduledAt).toLocaleString()}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {job.address}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No completed jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

