"use server";

import { verifyPassword, generateToken } from "../lib/auth";
import { prisma } from "../lib/db";
import { cookies } from "next/headers";
import { isValidEmail, isValidPassword } from "../lib/helperFunctions";

interface Errors {
  error?: string;
  success?: boolean;
}

export default async function signin(
  prevState: Errors,
  formData: FormData,
): Promise<Errors> {
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;

  if (!isValidEmail(email)) return { error: "Kindly enter a valid email" };
  if (!isValidPassword(password))
    return {
      error:
        "Password should be at least 8 characters long and contain at least 1 special character and 1 number",
    };

  try {
    // 1. Find user directly via Prisma — no HTTP round-trip
    const userFromDB = await prisma.user.findUnique({ where: { email } });
    if (!userFromDB) return { error: "Invalid credentials", success: false };

    // 2. Verify password
    const isCorrectPassword = await verifyPassword(
      password,
      userFromDB.password,
    );
    if (!isCorrectPassword)
      return { error: "Invalid credentials", success: false };

    // 3. Generate token and set cookie directly — this WILL reach the browser
    const token = generateToken(userFromDB.id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return {
      error: err instanceof Error ? err.message : "Login failed",
      success: false,
    };
  }
}
