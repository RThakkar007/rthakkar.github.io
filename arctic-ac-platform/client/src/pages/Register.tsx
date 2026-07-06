import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Snowflake, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function Register() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated]);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Account created! Welcome to ArcticAC.");
      navigate("/");
      window.location.reload();
    },
    onError: (err) => {
      setErrors(p => ({ ...p, general: err.message }));
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.phone) e.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(form.phone.replace(/[\s\-+]/g, ""))) e.phone = "Enter a valid 10-digit phone number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => { const n = { ...p }; delete n[field]; delete n.general; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    registerMutation.mutate({ name: form.name.trim(), email: form.email, phone: form.phone.replace(/[\s\-]/g, ""), password: form.password });
  };

  const Field = ({ id, label, icon: Icon, type = "text", placeholder, field, autoComplete }: any) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input id={id} type={type} value={form[field as keyof typeof form]} onChange={handleChange(field)}
          placeholder={placeholder} autoComplete={autoComplete}
          className={`pl-9 ${errors[field] ? "border-red-500 focus-visible:ring-red-500" : ""}`} />
      </div>
      {errors[field] && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Snowflake className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.register_title}</h1>
          <p className="text-muted-foreground mt-1">{t.register_subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{errors.general}</span>
            </div>
          )}
          <Field id="name" label="Full Name" icon={User} placeholder="Ronak Thakkar" field="name" autoComplete="name" />
          <Field id="email" label="Email Address" icon={Mail} type="email" placeholder="you@example.com" field="email" autoComplete="email" />
          <Field id="phone" label="Phone Number" icon={Phone} type="tel" placeholder="9876543210" field="phone" autoComplete="tel" />

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type={showPassword ? "text" : "password"} value={form.password}
                onChange={handleChange("password")} placeholder="Min. 6 characters" autoComplete="new-password"
                className={`pl-9 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`} />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="confirmPassword" type={showPassword ? "text" : "password"} value={form.confirmPassword}
                onChange={handleChange("confirmPassword")} placeholder="Re-enter password" autoComplete="new-password"
                className={`pl-9 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`} />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full btn-glow h-12 text-base" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : t.register_submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.register_have_account}{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">{t.register_login_link}</Link>
        </p>
      </div>
    </div>
  );
}
