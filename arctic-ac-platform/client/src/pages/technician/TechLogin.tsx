import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Snowflake, Wrench } from "lucide-react";

export default function TechLogin() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = trpc.technicians.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("tech_token", data.token);
      localStorage.setItem("tech_id", String(data.technician.id));
      localStorage.setItem("tech_name", data.technician.name);
      toast.success(`Welcome, ${data.technician.name}!`);
      navigate("/tech/dashboard");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="glass-card w-full max-w-sm">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Technician Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your jobs</p>
          </div>
          <div className="space-y-4">
            <div><Label>Email</Label><Input type="email" className="mt-1" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>Password</Label><Input type="password" className="mt-1" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
            <Button className="w-full btn-glow" disabled={loginMutation.isPending}
              onClick={() => loginMutation.mutate({ email: form.email, password: form.password })}>
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Snowflake className="w-4 h-4 text-primary" /> ArcticAC Technician App
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
