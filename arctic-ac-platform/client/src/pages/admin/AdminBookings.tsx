import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Search, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  assigned: "bg-primary/10 text-primary",
  on_the_way: "bg-yellow-500/10 text-yellow-400",
  in_progress: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminBookings() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [assignBookingId, setAssignBookingId] = useState<number | null>(null);
  const [selectedTech, setSelectedTech] = useState("");

  const { data: bookings, refetch } = trpc.bookings.adminList.useQuery({ limit: 100 }, { enabled: user?.role === "admin" });
  const { data: technicians } = trpc.technicians.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const assignMutation = trpc.bookings.adminAssign.useMutation({
    onSuccess: () => { toast.success("Technician assigned!"); setAssignBookingId(null); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const filtered = bookings?.filter(b =>
    b.bookingRef.includes(search.toUpperCase()) ||
    (b.guestName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (b.address ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Bookings">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by ref, customer, address..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground">
                  {["Ref", "Customer", "Address", "Status", "Technician", "Scheduled", "Payment", "Actions"].map(h => (
                    <th key={h} className="text-left p-4 font-medium">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {filtered?.map(b => (
                    <tr key={b.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-mono text-primary font-bold text-xs">{b.bookingRef}</td>
                      <td className="p-4">{b.guestName ?? `User #${b.userId}`}</td>
                      <td className="p-4 text-muted-foreground max-w-32 truncate">{b.address}</td>
                      <td className="p-4"><Badge className={`text-xs ${STATUS_COLOR[b.status]}`}>{b.status.replace(/_/g, " ")}</Badge></td>
                      <td className="p-4 text-muted-foreground">{b.technicianId ? `Tech #${b.technicianId}` : "—"}</td>
                      <td className="p-4 text-muted-foreground">{new Date(b.scheduledAt).toLocaleString()}</td>
                      <td className="p-4 capitalize text-muted-foreground">{b.paymentMethod}</td>
                      <td className="p-4">
                        <Button size="sm" variant="outline" onClick={() => setAssignBookingId(b.id)}>
                          <UserCheck className="w-3.5 h-3.5 mr-1" /> Assign
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!filtered || filtered.length === 0) && (
                    <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!assignBookingId} onOpenChange={() => setAssignBookingId(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Assign Technician</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger><SelectValue placeholder="Select technician" /></SelectTrigger>
              <SelectContent>
                {technicians?.map(t => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name} — {t.isAvailable ? "Available" : "Busy"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full btn-glow" disabled={!selectedTech || assignMutation.isPending}
              onClick={() => assignBookingId && assignMutation.mutate({ bookingId: assignBookingId, technicianId: Number(selectedTech) })}>
              {assignMutation.isPending ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
