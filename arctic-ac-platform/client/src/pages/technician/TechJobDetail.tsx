import { useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Clock, Phone, Camera, CheckCircle, Navigation } from "lucide-react";

const STATUS_FLOW = ["assigned", "on_the_way", "in_progress", "completed"];
const STATUS_LABELS: Record<string, string> = {
  assigned: "Assigned",
  on_the_way: "On the Way",
  in_progress: "In Progress",
  completed: "Completed",
};
const NEXT_STATUS: Record<string, string> = {
  assigned: "on_the_way",
  on_the_way: "in_progress",
  in_progress: "completed",
};
const NEXT_LABEL: Record<string, string> = {
  assigned: "Start Journey",
  on_the_way: "Arrived — Start Job",
  in_progress: "Mark as Completed",
};

export default function TechJobDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const techId = parseInt(localStorage.getItem("tech_id") ?? "0");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: job, refetch } = trpc.bookings.getById.useQuery({ id: parseInt(id ?? "0") }, { enabled: !!id });

  const updateStatusMutation = trpc.techJobs.updateJobStatus.useMutation({
    onSuccess: () => { toast.success("Status updated!"); refetch(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  const uploadProofMutation = trpc.techJobs.uploadProof.useMutation({
    onSuccess: () => { toast.success("Photo proof uploaded!"); refetch(); setUploading(false); },
    onError: (e: { message: string }) => { toast.error(e.message); setUploading(false); },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadProofMutation.mutate({
        bookingId: parseInt(id ?? "0"),
        technicianId: techId,
        fileData: base64,
        fileName: file.name,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const nextStatus = job?.status ? NEXT_STATUS[job.status] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center h-16 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/tech/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">Job Details</h1>
        </div>
      </header>

      <div className="container py-6 max-w-lg mx-auto space-y-4">
        {job ? (
          <>
            <Card className="glass-card border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-bold text-primary">{job.bookingRef}</span>
                  <Badge className="bg-primary/10 text-primary capitalize">{STATUS_LABELS[job.status] ?? job.status}</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Address</div>
                      <div className="text-sm">{job.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Scheduled</div>
                      <div className="text-sm">{new Date(job.scheduledAt).toLocaleString()}</div>
                    </div>
                  </div>
                  {job.guestPhone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Customer Phone</div>
                        <a href={`tel:${job.guestPhone}`} className="text-sm text-primary hover:underline">{job.guestPhone}</a>
                      </div>
                    </div>
                  )}
                  {job.notes && (
                    <div className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Notes: </span>{job.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status progress */}
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-sm">Job Progress</CardTitle></CardHeader>
              <CardContent className="pb-5">
                <div className="flex items-center gap-2">
                  {STATUS_FLOW.map((s, i) => {
                    const currentIdx = STATUS_FLOW.indexOf(job.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        {i < STATUS_FLOW.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2">
                  {STATUS_FLOW.map(s => (
                    <div key={s} className="text-xs text-muted-foreground text-center" style={{ width: `${100 / STATUS_FLOW.length}%` }}>{STATUS_LABELS[s]}</div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {nextStatus && (
                <Button className="w-full btn-glow h-12" disabled={updateStatusMutation.isPending}
                  onClick={() => updateStatusMutation.mutate({ bookingId: parseInt(id ?? "0"), technicianId: techId, status: nextStatus as any })}>
                  <Navigation className="w-4 h-4 mr-2" />
                  {NEXT_LABEL[job.status] ?? "Update Status"}
                </Button>
              )}

              {job.status === "in_progress" && (
                <>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                  <Button variant="outline" className="w-full h-12" disabled={uploading} onClick={() => fileRef.current?.click()}>
                    <Camera className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Photo Proof"}
                  </Button>
                </>
              )}

              {job.status === "completed" && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">Job Completed!</p>
                  <p className="text-sm text-muted-foreground mt-1">Great work! Payment: {job.paymentMethod === "cod" ? "Collect cash from customer" : "Online — already paid"}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">Loading job details...</div>
        )}
      </div>
    </div>
  );
}
