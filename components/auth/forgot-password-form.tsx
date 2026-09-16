"use client";

import { useActionState, useState } from "react";
import { sendForgotPasswordOtpAction, resetPasswordAction } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";
import { Loader2, Mail, Lock, Key, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [sendState, sendAction, isSending] = useActionState(sendForgotPasswordOtpAction, undefined);
  const [resetState, resetAction, isResetting] = useActionState(resetPasswordAction, undefined);

  const step = sendState?.step === "otp" ? "otp" : "email";

  return (
    <div className="w-full max-w-md mx-auto p-8 relative group">
      {/* Premium Glassmorphism Container */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] -z-10 transition-all duration-500 group-hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-3">
          {step === "email" ? "Forgot Password" : "Reset Password"}
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          {step === "email" ? "Enter your email to receive a reset code" : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      {step === "email" && (
        <form action={sendAction} className="space-y-6">
          <FieldGroup>
            <Field data-invalid={!!sendState?.errors?.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary/30 h-11 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSending}
                />
              </FieldContent>
              {sendState?.errors?.email && <FieldError>{sendState.errors.email[0]}</FieldError>}
            </Field>
          </FieldGroup>

          {sendState?.errors?._form && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {sendState.errors._form[0]}
            </div>
          )}

          {sendState?.message && (
             <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
               {sendState.message}
             </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending code...
              </>
            ) : (
              "Send Reset Code"
            )}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm font-medium text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      )}

      {step === "otp" && (
        <form action={resetAction} className="space-y-6">
          <input type="hidden" name="email" value={email} />

          <FieldGroup>
            <Field data-invalid={!!resetState?.errors?.otp}>
              <FieldLabel htmlFor="otp">Reset Code</FieldLabel>
              <FieldContent className="relative">
                <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary/30 h-11 transition-all duration-300 text-center text-lg tracking-widest"
                  disabled={isResetting}
                />
              </FieldContent>
              {resetState?.errors?.otp && <FieldError>{resetState.errors.otp[0]}</FieldError>}
            </Field>

            <Field data-invalid={!!resetState?.errors?.password}>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <FieldContent className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-background/50 border-white/10 focus-visible:ring-primary/30 h-11 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isResetting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </FieldContent>
              {resetState?.errors?.password && <FieldError>{resetState.errors.password[0]}</FieldError>}
            </Field>
          </FieldGroup>

          {resetState?.errors?._form && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {resetState.errors._form[0]}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
