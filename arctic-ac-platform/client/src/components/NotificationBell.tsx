import { useState } from "react";
import { Bell, X, CheckCircle, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  job_assigned: <CheckCircle className="w-4 h-4 text-primary" />,
  on_the_way: <Navigation className="w-4 h-4 text-blue-400" />,
  completed: <CheckCircle className="w-4 h-4 text-green-400" />,
  new_booking: <Clock className="w-4 h-4 text-yellow-400" />,
  job_accepted: <CheckCircle className="w-4 h-4 text-primary" />,
  payment: <CheckCircle className="w-4 h-4 text-green-400" />,
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: notifications, refetch } = trpc.notifications.myNotifications.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => refetch(),
  });

  const unread = (notifications ?? []).filter(n => !n.isRead).length;

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(o => !o)}>
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {(notifications ?? []).length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            <div>
              {(notifications ?? []).map(n => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
                  onClick={() => { if (!n.isRead) markReadMutation.mutate({ id: n.id }); }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{TYPE_ICONS[n.type] ?? <Bell className="w-4 h-4" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
