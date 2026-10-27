"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  Shirt,
  Scissors,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (registerError) {
        // Keep the technical error out of the frontend.
        console.error("Registration failed:", registerError);
        setError("Unable to create your account. Please check your details and try again.");
        return;
      }

      if (data.session) {
        router.push("/login");
        return;
      }

      setMessage(
        "If registration was successful, please check your email for next steps."
      );
    } catch (err) {
      // Log unexpected errors for development.
      console.error("Unexpected registration error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-12 overflow-hidden">
      {/* Background Floating Ambient Graphic Accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D9F99D]/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#D9F99D]/20 blur-3xl pointer-events-none" />

      {/* Floating Clothing SVG Pattern Decorators */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
        <div className="absolute top-12 right-12 text-[#29231F] rotate-12 animate-pulse">
          <Shirt size={120} strokeWidth={1} />
        </div>
        <div className="absolute bottom-16 left-12 text-[#29231F] -rotate-12">
          <ShoppingBag size={140} strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 left-1/4 text-[#29231F] rotate-45 hidden md:block">
          <Scissors size={80} strokeWidth={1} />
        </div>
      </div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#E9DFD4] bg-white/80 backdrop-blur-xl p-6 shadow-xl sm:p-10">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9F99D] text-[#29231F] shadow-sm">
              <ShoppingBag size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#29231F]">
              UrbanWear
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-[#29231F] sm:text-3xl">
            Create Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Join us and discover your style.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#29231F]">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              maxLength={100}
              autoComplete="name"
              disabled={loading}
              className="w-full rounded-xl border border-[#E9DFD4] bg-white/90 px-4 py-3 text-sm text-[#29231F] outline-none transition-all placeholder:text-gray-400 focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D] disabled:opacity-60"
            />
          </div>

          {/* Email Address Field */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#29231F]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-xl border border-[#E9DFD4] bg-white/90 px-4 py-3 text-sm text-[#29231F] outline-none transition-all placeholder:text-gray-400 focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D] disabled:opacity-60"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#29231F]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-[#E9DFD4] bg-white/90 px-4 py-3 pr-11 text-sm text-[#29231F] outline-none transition-all placeholder:text-gray-400 focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D] disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#29231F] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Safe Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-center text-xs text-red-600"
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50/80 p-3 text-center text-xs text-green-700"
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9F99D] py-3 text-sm font-bold text-[#29231F] shadow-sm transition-all hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 mt-2"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Sign In Link */}
        <p className="mt-8 text-center text-xs sm:text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#29231F] hover:underline decoration-[#D9F99D] decoration-2 underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}