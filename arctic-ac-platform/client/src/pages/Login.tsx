import { useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Snowflake className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome Back</h1>
        <p className="text-muted-foreground mb-8">Sign in to manage your bookings and track services.</p>
        <Button className="w-full btn-glow h-12 text-base" asChild>
          <a href={getLoginUrl()}>Continue with Manus</a>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account? <a href={getLoginUrl()} className="text-primary hover:underline">Register here</a>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <Link href="/forgot-password" className="text-primary hover:underline">Forgot your password?</Link>
        </p>
      </div>
    </div>
  );
}
