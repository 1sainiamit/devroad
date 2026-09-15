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



export type SignupState = {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function signupAction(
  prevState: SignupState | undefined,
  formData: FormData
): Promise<SignupState> {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: { email: ["An account with this email already exists."] },
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

    await createSession(user.id);
  } catch (error) {
    return {
      errors: { _form: ["An unexpected error occurred."] },
    };
  }

  redirect("/dashboard");
}
