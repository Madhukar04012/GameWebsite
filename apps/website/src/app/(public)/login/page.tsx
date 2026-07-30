"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Gamepad2, Sword, Users, Shield } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both email and password are required to enter the realm.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setError("Authentication server not yet connected. (Dev mode)");
  }

  return (
    <div className="pt-24 pb-24 bg-background min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 40%, rgba(212,175,55,0.4) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 70% 60%, rgba(212,175,55,0.2) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
          {/* Left side - Features */}
          <AnimatedSection variant="fade-left" className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl font-heading text-primary mb-6 leading-[0.9]">
                Welcome Back
                <br />
                <span className="text-white">Champion</span>
              </h1>
              <p className="text-text-secondary font-body text-sm mb-8 leading-relaxed">
                Sign in to continue your journey. The realm remembers your deeds.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Sword, text: "Track your character progression and achievements" },
                  { icon: Users, text: "Connect with your guild and manage your roster" },
                  { icon: Shield, text: "Secure your account with two-factor authentication" },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-muted border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xs text-text-secondary font-body">{f.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-10 pt-8 border-t border-border flex gap-8">
                {[
                  { label: "Active Players", value: "2.4M+" },
                  { label: "Online Now", value: "128K" },
                  { label: "Guilds", value: "45K+" },
                ].map((s) => (
                  <div key={s.label}>
                    <span className="block text-2xl font-heading text-primary">{s.value}</span>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-body">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Right side - Login form */}
          <AnimatedSection variant="fade-right" className="max-w-md mx-auto lg:mx-0 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              {/* Mobile header */}
              <div className="lg:hidden text-center mb-8">
                <h1 className="text-4xl font-heading text-primary mb-2">Welcome Back</h1>
                <p className="text-text-secondary font-subheading text-sm">Sign in to continue your journey.</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-error-bg border border-error/30 rounded-lg px-4 py-3 text-error text-sm font-body mb-6"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-text-muted font-body mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full bg-surface border border-border rounded-lg pl-11 pr-4 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs uppercase tracking-widest text-text-muted font-body mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full bg-surface border border-border rounded-lg pl-11 pr-12 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border bg-surface accent-primary"
                    />
                    <span className="text-xs text-text-muted font-body">Remember me</span>
                  </label>
                  <Link href="#" className="text-xs text-text-muted hover:text-primary font-body transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-background font-heading text-xl uppercase tracking-wider py-3 rounded-lg transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? "Entering Realm..." : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-body">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social auth */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-surface border border-border rounded-lg py-2.5 text-xs text-text-secondary hover:text-primary hover:border-primary/30 transition-colors font-body">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 bg-surface border border-border rounded-lg py-2.5 text-xs text-text-secondary hover:text-primary hover:border-primary/30 transition-colors font-body">
                  <Gamepad2 className="w-4 h-4" />
                  Steam
                </button>
              </div>

              {/* Sign up */}
              <p className="text-center text-text-muted font-body text-xs mt-6">
                Don&apos;t have an account?{" "}
                <Link href="#" className="text-primary hover:text-white transition-colors">
                  Create Account
                </Link>
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
