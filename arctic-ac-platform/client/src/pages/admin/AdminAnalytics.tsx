import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminAnalytics() {
  const { user } = useAuth();
  const { data: analytics } = trpc.analytics.summary.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: techPerf } = trpc.analytics.technicianPerformance.useQuery(undefined, { enabled: user?.role === "admin" });

  const pieData = [
    { name: "Completed", value: analytics?.completedBookings ?? 0, color: "#22c55e" },
    { name: "Pending", value: analytics?.pendingBookings ?? 0, color: "#f59e0b" },
    { name: "Other", value: Math.max(0, (analytics?.totalBookings ?? 0) - (analytics?.completedBookings ?? 0) - (analytics?.pendingBookings ?? 0)), color: "#6366f1" },
  ];

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: analytics?.totalBookings ?? 0 },
            { label: "Today", value: analytics?.todayBookings ?? 0 },
            { label: "Completion Rate", value: `${analytics?.completionRate ?? 0}%` },
            { label: "Revenue", value: `₹${analytics?.totalRevenue?.toFixed(0) ?? 0}` },
          ].map((s, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-5 text-center">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">Booking Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">Technician Performance</CardTitle></CardHeader>
            <CardContent>
              {techPerf && techPerf.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={techPerf}>
                    <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px" }} />
                    <Bar dataKey="completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Completed" />
                    <Bar dataKey="total" fill="var(--color-muted)" radius={[4, 4, 0, 0]} name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No technician data yet.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {techPerf && techPerf.length > 0 && (
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">Technician Leaderboard</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground">
                    {["Technician", "Total Jobs", "Completed", "Completion Rate"].map(h => (
                      <th key={h} className="text-left p-3 font-medium">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {techPerf.sort((a, b) => b.rate - a.rate).map(t => (
                      <tr key={t.id} className="hover:bg-muted/10">
                        <td className="p-3 font-medium">{t.name}</td>
                        <td className="p-3">{t.total}</td>
                        <td className="p-3 text-green-400">{t.completed}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${t.rate}%` }} />
                            </div>
                            <span className="text-primary font-bold text-xs">{t.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
