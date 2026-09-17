import { SignupForm } from "@/components/auth/signup-form"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new Devroad account.",
};


export default function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative overflow-hidden bg-background">
      {/* Background gradients for premium feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      
      <div className="w-full relative z-10">
        <SignupForm />
      </div>
    </div>
  )
}
