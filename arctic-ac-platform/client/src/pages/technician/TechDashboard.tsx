import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Snowflake, LogOut, MapPin, Clock, CheckCircle, Bell, History, Wrench } from "lucide-react";
import type { Booking } from "../../../../drizzle/schema";

export default function TechDashboard() {
  const [, navigate] = useLocation();
  const techId = parseInt(localStorage.getItem("tech_id") ?? "0");
  const techName = localStorage.getItem("tech_name") ?? "Technician";

  useEffect(() => { if (!techId) navigate("/tech/login"); }, [techId]);

  const { data: jobs, refetch } = trpc.techJobs.myJobs.useQuery(
    { technicianId: techId },
    { enabled: !!techId, refetchInterval: 15000 }
  );

  const respondMutation = trpc.techJobs.respondToJob.useMutation({
    onSuccess: (_: unknown, vars: { bookingId: number; technicianId: number; accept: boolean }) => {
      toast.success(vars.accept ? "Job accepted!" : "Job declined.");
      refetch();
    },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const updateLocationMutation = trpc.technicians.updateLocation.useMutation({
    onSuccess: () => toast.success("Location updated!"),
  });

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      pos => updateLocationMutation.mutate({ id: techId, latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => toast.error("Could not get location.")
    );
  };

  const pendingJobs = (jobs ?? []).filter((j: Booking) => j.status === "pending");
  const activeJobs = (jobs ?? []).filter((j: Booking) => ["assigned", "on_the_way", "in_progress"].includes(j.status));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ArcticAC</div>
              <div className="text-xs text-muted-foreground">{techName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUpdateLocation}>
              <MapPin className="w-4 h-4 mr-1" /> Update GPS
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              localStorage.removeItem("tech_token");
              localStorage.removeItem("tech_id");
              localStorage.removeItem("tech_name");
              navigate("/tech/login");
            }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Bell, label: "New Jobs", count: pendingJobs.length, color: "text-yellow-400" },
            { icon: Wrench, label: "Active", count: activeJobs.length, color: "text-primary" },
            { icon: CheckCircle, label: "Done Today", count: (jobs ?? []).filter((j: Booking) => j.status === "completed").length, color: "text-green-400" },
          ].map((s, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 text-center">
                <s.icon className={`w-6 h-6 mx-auto mb-1 ${s.color}`} />
                <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending job requests */}
        {pendingJobs.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-400" /> New Job Requests
              <Badge className="bg-yellow-500/10 text-yellow-400">{pendingJobs.length}</Badge>
            </h2>
            <div className="space-y-3">
              {pendingJobs.map((job: Booking) => (
                <Card key={job.id} className="glass-card border-yellow-500/20">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono font-bold text-primary text-sm">{job.bookingRef}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" /> {new Date(job.scheduledAt).toLocaleString()}
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-400">New Request</Badge>
                    </div>
                    <div className="flex items-start gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" /> {job.address}
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 btn-glow" size="sm"
                        onClick={() => respondMutation.mutate({ bookingId: job.id, technicianId: techId, accept: true })}>
                        Accept Job
                      </Button>
                      <Button variant="outline" size="sm"
                        onClick={() => respondMutation.mutate({ bookingId: job.id, technicianId: techId, accept: false })}>
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active jobs */}
        {activeJobs.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" /> Active Jobs
            </h2>
            <div className="space-y-3">
              {activeJobs.map((job: Booking) => (
                <Card key={job.id} className="glass-card border-primary/20">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-mono font-bold text-primary text-sm">{job.bookingRef}</div>
                      <Badge className="bg-primary/10 text-primary capitalize">{job.status.replace(/_/g, " ")}</Badge>
                    </div>
                    <div className="flex items-start gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary" /> {job.address}
                    </div>
                    <Button className="w-full btn-glow" size="sm" asChild>
                      <Link href={`/tech/job/${job.id}`}>View Job Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {pendingJobs.length === 0 && activeJobs.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No pending jobs. You're all caught up!</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/tech/history"><History className="w-4 h-4 mr-2" /> View Job History</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
