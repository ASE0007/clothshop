import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import prisma from "./prisma";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE = "clothshop_admin";
const SESSION_AGE_MS = 1000 * 60 * 60 * 8; // 8 hours

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const test = scryptSync(password, salt, 64).toString("hex");
  const buf = Buffer.from(hash);
  const testBuf = Buffer.from(test);
  return buf.length === testBuf.length && timingSafeEqual(buf, testBuf);
}

export function getAdminCredentials() {
  return { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
}

export async function verifyAdmin(username, password) {
  if (username !== ADMIN_USERNAME) return false;
  const stored = hashPassword(ADMIN_PASSWORD);
  return verifyPassword(password, stored);
}

export async function createSession() {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_AGE_MS);
  await prisma.session.create({ data: { token, expiresAt } });
  return token;
}

export async function destroySession(token) {
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
}

export async function getCurrentAdmin() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    return null;
  }
  return { username: ADMIN_USERNAME };
}

export function setSessionCookie(token) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_AGE_MS / 1000,
  };
}

export function clearSessionCookie() {
  return { name: SESSION_COOKIE, value: "", path: "/", maxAge: 0 };
}