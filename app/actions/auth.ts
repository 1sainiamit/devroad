"use server";

import { createSession, deleteSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { loginSchema, signupSchema } from "@/lib/validations/auth";

export type AuthState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function loginAction(
  prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.hashedPassword) {
      return {
        errors: { _form: ["Invalid email or password."] },
      };
    }

    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordsMatch) {
      return {
        errors: { _form: ["Invalid email or password."] },
      };
    }

    await createSession(user.id);
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}



import { verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { sendOtpEmail } from "@/lib/mail";

export type SignupState = {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    otp?: string[];
    _form?: string[];
  };
  message?: string | null;
  step?: "email" | "otp";
};

export async function sendSignupOtpAction(
  prevState: SignupState | undefined,
  formData: FormData
): Promise<SignupState> {
  const validatedFields = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      step: "email",
    };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: { email: ["An account with this email already exists."] },
        step: "email",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email
    await prisma.otpToken.deleteMany({ where: { email } });

    await prisma.otpToken.create({
      data: {
        email,
        token: otp,
        expiresAt,
      },
    });

    await sendOtpEmail(email, otp);

    return {
      message: "OTP sent successfully.",
      step: "otp",
    };
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
      step: "email",
    };
  }
}

export async function verifySignupOtpAction(
  prevState: SignupState | undefined,
  formData: FormData
): Promise<SignupState> {
  const validatedFields = verifyOtpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    otp: formData.get("otp"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      step: "otp",
    };
  }

  const { email, password, name, otp } = validatedFields.data;

  try {
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        email,
        token: otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return {
        errors: { otp: ["Invalid or expired OTP."] },
        step: "otp",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: { email: ["An account with this email already exists."] },
        step: "otp",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
      },
    });

    await prisma.otpToken.deleteMany({ where: { email } });

    await createSession(user.id);
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
      step: "otp",
    };
  }

  redirect("/dashboard");
}

export type ForgotPasswordState = {
  errors?: {
    email?: string[];
    password?: string[];
    otp?: string[];
    _form?: string[];
  };
  message?: string | null;
  step?: "email" | "otp";
};

export async function sendForgotPasswordOtpAction(
  prevState: ForgotPasswordState | undefined,
  formData: FormData
): Promise<ForgotPasswordState> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      step: "email",
    };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return {
        errors: { email: ["No account found with this email address."] },
        step: "email",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email
    await prisma.otpToken.deleteMany({ where: { email } });

    await prisma.otpToken.create({
      data: {
        email,
        token: otp,
        expiresAt,
      },
    });

    await sendOtpEmail(email, otp);

    return {
      message: "OTP sent successfully.",
      step: "otp",
    };
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
      step: "email",
    };
  }
}

export async function resetPasswordAction(
  prevState: ForgotPasswordState | undefined,
  formData: FormData
): Promise<ForgotPasswordState> {
  const validatedFields = resetPasswordSchema.safeParse({
    email: formData.get("email"),
    otp: formData.get("otp"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      step: "otp",
    };
  }

  const { email, password, otp } = validatedFields.data;

  try {
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        email,
        token: otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return {
        errors: { otp: ["Invalid or expired OTP."] },
        step: "otp",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return {
        errors: { _form: ["An unexpected error occurred."] },
        step: "otp",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: {
        hashedPassword,
      },
    });

    await prisma.otpToken.deleteMany({ where: { email } });
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
      step: "otp",
    };
  }

  redirect("/login");
}
