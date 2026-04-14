"use server";

import { hashPassword, generateToken } from "../lib/auth";
import { prisma } from "../lib/db";
import { cookies } from "next/headers";
import { isValidEmail, isValidName, isValidPassword } from "../lib/helperFunctions";
import { Role } from "../types";

interface Errors {
  error?: string;
  success?: boolean;
}

export default async function signup(
  prevState: Errors,
  formData: FormData,
): Promise<Errors> {
  const firstname = formData.get("firstname") as string;
  const surname = formData.get("surname") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const errors: Errors = {};

  if (!firstname || !surname || !password)
    errors.error = "All fields are required";
  if (!isValidName(firstname, surname))
    errors.error =
      "Both firstname and surname should be at least two letters and not contain any special character";
  if (!isValidEmail(email)) errors.error = "Kindly enter a valid email";
  const fullname = `${firstname} ${surname}`;
  if (!isValidPassword(password))
    errors.error =
      "Password should be at least 8 characters long and contain at least 1 special character and 1 number";

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already taken!", success: false };
    }

    const hashedPassword = await hashPassword(password);
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
      data: {
        name: fullname,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (err) {
    console.error("Registeration error ", err);
    return {
      error: err instanceof Error ? err.message : "Registeration failed",
      success: false,
    };
  }
}
