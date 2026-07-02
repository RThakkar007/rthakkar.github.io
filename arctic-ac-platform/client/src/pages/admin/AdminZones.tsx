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
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminZones() {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const { data: zones, refetch } = trpc.zones.list.useQuery();
  const createMutation = trpc.zones.create.useMutation({
    onSuccess: () => { toast.success("Zone added!"); setShowAdd(false); refetch(); },
    onError: e => toast.error(e.message),
  });
  const updateMutation = trpc.zones.update.useMutation({
    onSuccess: () => { toast.success("Updated!"); refetch(); },
  });

  return (
    <AdminLayout title="Zones & Areas">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button className="btn-glow" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-2" /> Add Zone</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones?.map(z => (
            <Card key={z.id} className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{z.name}</h3>
                  <Badge className={z.isActive ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}>{z.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                {z.description && <p className="text-sm text-muted-foreground mb-3">{z.description}</p>}
                <Button size="sm" variant="outline" className="w-full"
                  onClick={() => updateMutation.mutate({ id: z.id, isActive: !z.isActive })}>
                  {z.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}
          {(!zones || zones.length === 0) && (
            <div className="col-span-3 text-center py-12 text-muted-foreground">No zones configured yet.</div>
          )}
        </div>
      </div>
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add Zone</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Zone Name</Label><Input className="mt-1" placeholder="e.g. North Ahmedabad" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea className="mt-1" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <Button className="w-full btn-glow" disabled={createMutation.isPending}
              onClick={() => createMutation.mutate({ name: form.name, description: form.description })}>
              Add Zone
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
