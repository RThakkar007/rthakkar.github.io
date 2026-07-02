import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function AdminPayments() {
  const { user } = useAuth();
  const { data: payments, refetch } = trpc.payments.adminList.useQuery(undefined, { enabled: user?.role === "admin" });
  const markPaidMutation = trpc.payments.markCodPaid.useMutation({
    onSuccess: () => { toast.success("Marked as paid!"); refetch(); },
    onError: e => toast.error(e.message),
  });

  const total = payments?.filter(p => p.status === "paid").reduce((sum, p) => sum + parseFloat(p.amount), 0) ?? 0;

  return (
    <AdminLayout title="Payments">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Revenue", value: `₹${total.toFixed(0)}`, color: "text-green-400" },
            { label: "Total Transactions", value: payments?.length ?? 0, color: "text-primary" },
            { label: "Pending COD", value: payments?.filter(p => p.status === "pending" && p.method === "cod").length ?? 0, color: "text-yellow-400" },
          ].map((s, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-5">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground">
                  {["Booking ID", "Amount", "Method", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left p-4 font-medium">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {payments?.map(p => (
                    <tr key={p.id} className="hover:bg-muted/10">
                      <td className="p-4 font-mono text-primary">#{p.bookingId}</td>
                      <td className="p-4 font-bold">₹{p.amount}</td>
                      <td className="p-4 capitalize">{p.method}</td>
                      <td className="p-4"><Badge className={
                        p.status === "paid" ? "bg-green-500/10 text-green-400" :
                        p.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-destructive/10 text-destructive"
                      }>{p.status}</Badge></td>
                      <td className="p-4 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {p.status === "pending" && p.method === "cod" && (
                          <Button size="sm" variant="outline" onClick={() => markPaidMutation.mutate({ bookingId: p.bookingId })}>
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!payments || payments.length === 0) && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No payments yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
