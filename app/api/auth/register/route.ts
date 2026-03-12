import { hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();
    // Validate user details
    if (!name || !email || !password)
      return NextResponse.json(
        {
          error: "Kindly provide valid entries for name, email and password!",
        },
        { status: 400 },
      );

    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser)
      return NextResponse.json(
        {
          error: "Email already taken!",
        },
        { status: 409 },
      );
    // If there's no existing user with provided email, hash the provided password
    const hashedPassword = hashPassword(password);

    // Store user details including hashedPassword in the database
  } catch (error) {
    console.error("Error:", error);
  }
}
