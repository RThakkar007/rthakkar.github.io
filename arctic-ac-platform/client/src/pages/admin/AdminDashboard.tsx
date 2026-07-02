import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CalendarCheck, Users, CheckCircle, Clock, TrendingUp, DollarSign } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!loading && user && user.role !== "admin") navigate("/"); }, [loading, user]);

  const { data: analytics } = trpc.analytics.summary.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: bookings } = trpc.bookings.adminList.useQuery({ limit: 5 }, { enabled: user?.role === "admin" });

  const stats = [
    { icon: CalendarCheck, label: "Total Bookings", value: analytics?.totalBookings ?? 0, color: "text-primary" },
    { icon: Clock, label: "Today's Bookings", value: analytics?.todayBookings ?? 0, color: "text-yellow-400" },
    { icon: CheckCircle, label: "Completed", value: analytics?.completedBookings ?? 0, color: "text-green-400" },
    { icon: TrendingUp, label: "Completion Rate", value: `${analytics?.completionRate ?? 0}%`, color: "text-blue-400" },
    { icon: Clock, label: "Pending", value: analytics?.pendingBookings ?? 0, color: "text-orange-400" },
    { icon: DollarSign, label: "Total Revenue", value: `₹${analytics?.totalRevenue?.toFixed(0) ?? 0}`, color: "text-green-400" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Recent Bookings</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground">
                  <th className="text-left pb-3 font-medium">Ref</th>
                  <th className="text-left pb-3 font-medium">Customer</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Scheduled</th>
                  <th className="text-left pb-3 font-medium">Payment</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {bookings?.map(b => (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 font-mono text-primary font-bold">{b.bookingRef}</td>
                      <td className="py-3">{b.guestName ?? `User #${b.userId}`}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        b.status === "completed" ? "bg-green-500/10 text-green-400" :
                        b.status === "assigned" ? "bg-primary/10 text-primary" :
                        b.status === "on_the_way" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-muted text-muted-foreground"
                      }`}>{b.status.replace(/_/g, " ")}</span></td>
                      <td className="py-3 text-muted-foreground">{new Date(b.scheduledAt).toLocaleDateString()}</td>
                      <td className="py-3 capitalize text-muted-foreground">{b.paymentMethod}</td>
                    </tr>
                  ))}
                  {(!bookings || bookings.length === 0) && (
                    <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No bookings yet.</td></tr>
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
