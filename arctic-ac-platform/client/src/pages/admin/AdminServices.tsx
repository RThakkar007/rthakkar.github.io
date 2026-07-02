import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminServices() {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "60", category: "" });

  const { data: services, refetch } = trpc.services.listAdmin.useQuery(undefined, { enabled: user?.role === "admin" });
  const createMutation = trpc.services.create.useMutation({
    onSuccess: () => { toast.success("Service added!"); setShowAdd(false); refetch(); },
    onError: e => toast.error(e.message),
  });
  const updateMutation = trpc.services.update.useMutation({
    onSuccess: () => { toast.success("Updated!"); refetch(); },
  });

  return (
    <AdminLayout title="Services">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button className="btn-glow" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map(s => (
            <Card key={s.id} className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{s.name}</h3>
                  <Badge className={s.isActive ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}>{s.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">₹{s.price}</span>
                  <span className="text-xs text-muted-foreground">{s.duration} min</span>
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full"
                  onClick={() => updateMutation.mutate({ id: s.id, isActive: !s.isActive })}>
                  {s.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea className="mt-1" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹)</Label><Input className="mt-1" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
              <div><Label>Duration (min)</Label><Input type="number" className="mt-1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} /></div>
            </div>
            <div><Label>Category</Label><Input className="mt-1" placeholder="e.g. Repair, Installation" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
            <Button className="w-full btn-glow" disabled={createMutation.isPending}
              onClick={() => createMutation.mutate({ name: form.name, description: form.description, price: form.price, duration: Number(form.duration), category: form.category })}>
              Add Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
