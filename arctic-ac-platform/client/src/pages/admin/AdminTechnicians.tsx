import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Phone, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminTechnicians() {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", zoneId: "" });

  const { data: technicians, refetch } = trpc.technicians.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: zones } = trpc.zones.list.useQuery();
  const createMutation = trpc.technicians.create.useMutation({
    onSuccess: () => { toast.success("Technician added!"); setShowAdd(false); setForm({ name: "", email: "", phone: "", password: "", zoneId: "" }); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.technicians.update.useMutation({
    onSuccess: () => { toast.success("Updated!"); refetch(); },
  });

  return (
    <AdminLayout title="Technicians">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button className="btn-glow" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-2" /> Add Technician</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians?.map(t => (
            <Card key={t.id} className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <Badge className={t.isAvailable ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}>
                    {t.isAvailable ? "Available" : "On Job"}
                  </Badge>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-3.5 h-3.5" /> {t.phone}</div>
                  {t.latitude && t.longitude && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-3.5 h-3.5" /> {t.latitude.toFixed(4)}, {t.longitude.toFixed(4)}</div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1"
                    onClick={() => updateMutation.mutate({ id: t.id, isAvailable: !t.isAvailable })}>
                    {t.isAvailable ? "Mark Busy" : "Mark Available"}
                  </Button>
                  <Button size="sm" variant="outline"
                    onClick={() => updateMutation.mutate({ id: t.id, isActive: !t.isActive })}>
                    {t.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!technicians || technicians.length === 0) && (
            <div className="col-span-3 text-center py-12 text-muted-foreground">No technicians yet. Add your first technician.</div>
          )}
        </div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add Technician</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Email</Label><Input type="email" className="mt-1" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Password</Label><Input type="password" className="mt-1" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
            <div><Label>Zone</Label>
              <Select value={form.zoneId} onValueChange={v => setForm(f => ({ ...f, zoneId: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select zone" /></SelectTrigger>
                <SelectContent>{zones?.map(z => <SelectItem key={z.id} value={String(z.id)}>{z.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button className="w-full btn-glow" disabled={createMutation.isPending}
              onClick={() => createMutation.mutate({ name: form.name, email: form.email, phone: form.phone, password: form.password, zoneId: form.zoneId ? Number(form.zoneId) : undefined })}>
              {createMutation.isPending ? "Adding..." : "Add Technician"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
