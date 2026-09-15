import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-please-change-in-production";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const ACCESS_TOKEN_EXPIRATION = "15m";

export type SessionPayload = {
  userId: string;
};

export async function signAccessToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .sign(secretKey);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}
