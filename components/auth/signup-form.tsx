"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signupSchema } from "@/lib/validations/auth";
import { signupAction } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";
import { Loader2, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.name) formData.append("name", data.name);

    startTransition(async () => {
      const result = await signupAction(undefined, formData);
      
      if (result?.errors) {
        if (result.errors.email) {
          setError("email", { message: result.errors.email[0] });
        }
        if (result.errors.password) {
          setError("password", { message: result.errors.password[0] });
        }
        if (result.errors.name) {
          setError("name", { message: result.errors.name[0] });
        }
        if (result.errors._form) {
          setError("root", { message: result.errors._form[0] });
        }
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 relative group">
      {/* Premium Glassmorphism Container */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] -z-10 transition-all duration-500 group-hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-3">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Start selling your digital products today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name (Optional)</FieldLabel>
            <FieldContent className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary/30 h-11 transition-all duration-300"
                {...register("name")}
                disabled={isPending}
              />
            </FieldContent>
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldContent className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary/30 h-11 transition-all duration-300"
                {...register("email")}
                disabled={isPending}
              />
            </FieldContent>
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldContent className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/60" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-background/50 border-white/10 focus-visible:ring-primary/30 h-11 transition-all duration-300"
                {...register("password")}
                disabled={isPending}
              />
            </FieldContent>
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>
        </FieldGroup>

        {errors.root && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
