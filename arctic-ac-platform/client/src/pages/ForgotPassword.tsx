import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowLeft, CheckCircle, Snowflake } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate sending reset email (backend integration point)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Password reset instructions sent!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Snowflake className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Arctic<span className="text-primary">AC</span>
            </span>
          </div>

          <Card className="glass-card">
            <CardContent className="p-6 sm:p-8">
              {!submitted ? (
                <>
                  <div className="text-center mb-6">
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Password Recovery</Badge>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Forgot Password?
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Enter your registered email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9 min-h-[48px]"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-glow min-h-[48px] text-base"
                      disabled={loading || !email.trim()}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : "Send Reset Instructions"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center space-y-2">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-primary hover:underline font-medium">
                        Register
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Check Your Email
                  </h2>
                  <p className="text-muted-foreground text-sm mb-2">
                    We've sent password reset instructions to:
                  </p>
                  <p className="font-medium text-primary mb-6">{email}</p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      className="text-primary hover:underline"
                      onClick={() => setSubmitted(false)}
                    >
                      try again
                    </button>.
                  </p>
                  <Button className="w-full btn-glow min-h-[48px]" asChild>
                    <Link href="/login">Back to Login</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
