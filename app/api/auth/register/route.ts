import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";


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

    let teamId: string | undefined;

    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: {
          code: teamCode,
        },
      });

      if (!team)
        return NextResponse.json(
          {
            message: "Invalid team code provided",
          },
          { status: 400 },
        );

      teamId = team.id;
    }

    // If there's no existing user with provided email, hash the provided password
    const hashedPassword = await hashPassword(password);

    // First User becomes ADMIN, others become USER
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        teamId,
      },
      include: {
        team: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: user.team,
        teamId: user.teamId,
        token,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registeration error", error);
    return NextResponse.json({
      message: `Internal server error, something went wrong!`,
    });
  }
}
