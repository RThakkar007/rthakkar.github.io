import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminMap() {
  const { user } = useAuth();
  const { data: technicians, refetch, isLoading } = trpc.technicians.list.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchInterval: 30000,
  });

  const withLocation = technicians?.filter(t => t.latitude && t.longitude) ?? [];
  const withoutLocation = technicians?.filter(t => !t.latitude || !t.longitude) ?? [];

  return (
    <AdminLayout title="Live Map">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{withLocation.length} technician(s) with live GPS location. Auto-refreshes every 30s.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Map placeholder — Google Maps integration */}
        <Card className="glass-card">
          <CardContent className="p-0 overflow-hidden rounded-xl">
            <div className="relative w-full h-96 bg-muted/20 flex items-center justify-center border border-border rounded-xl">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-medium">Google Maps Integration</p>
                <p className="text-sm text-muted-foreground mt-1">Add your Google Maps API key to enable live technician tracking.</p>
                <p className="text-xs text-muted-foreground mt-2">Configure in Admin → Settings → Google Maps API Key</p>
              </div>
              {/* Overlay technician pins */}
              {withLocation.map((t, i) => (
                <div key={t.id} className="absolute" style={{ top: `${20 + i * 15}%`, left: `${20 + i * 20}%` }}>
                  <div className="relative group">
                    <div className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold cursor-pointer ${t.isAvailable ? "bg-green-500" : "bg-yellow-500"}`}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10">
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-muted-foreground">{t.latitude?.toFixed(4)}, {t.longitude?.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technician list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians?.map(t => (
            <Card key={t.id} className="glass-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.isAvailable ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{t.name}</div>
                  {t.latitude && t.longitude ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      {t.latitude.toFixed(4)}, {t.longitude.toFixed(4)}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground mt-0.5">No GPS data</div>
                  )}
                </div>
                <Badge className={t.isAvailable ? "bg-green-500/10 text-green-400 text-xs" : "bg-yellow-500/10 text-yellow-400 text-xs"}>
                  {t.isAvailable ? "Free" : "Busy"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

