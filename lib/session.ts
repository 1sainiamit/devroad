import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { signAccessToken, verifyAccessToken } from "./jwt";

export const REFRESH_TOKEN_EXPIRATION_DAYS = 7;

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  
  // 1. Create Access Token
  const accessToken = await signAccessToken({ userId });
  
  // 2. Create Refresh Token (Opaque token)
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
  
  // Save refresh token in DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });

  // 3. Set Cookies
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes in seconds
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60, // days in seconds
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    try {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    } catch (e) {
      // Token might already be deleted or not found
    }
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function refreshSession() {
  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get("refresh_token")?.value;

  if (!oldRefreshToken) {
    return null;
  }

  // Find token in DB
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    await deleteSession();
    return null;
  }

  // Check if expired
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await deleteSession();
    return null;
  }

  // Invalidate old refresh token (rotation)
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  // Issue new tokens
  await createSession(storedToken.userId);

  return storedToken.userId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  return await verifyAccessToken(accessToken);
}

export async function getCurrentUser() {
  const payload = await getSession();
  
  if (!payload || !payload.userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}
