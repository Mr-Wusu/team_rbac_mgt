import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { Role, User } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function getCurrentuser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;
    const decode = verifyToken(token);

    // Add timeout to prevent hanging database queries
    const userFromDB = await Promise.race([
      prisma.user.findUnique({
        where: {
          id: decode.userId,
        },
      }),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 5000),
      ),
    ]);

    if (!userFromDB) return null;

    const { ...user } = userFromDB;
    return user as User;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export function checkUserPermission(user: User, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.GUEST]: 0,
    [Role.USER]: 1,
    [Role.MANAGER]: 2,
    [Role.ADMIN]: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
