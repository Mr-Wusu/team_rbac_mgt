import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";


import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {email, password} = await request.json();
    // Validate user details
    if (!email || !password)
      return NextResponse.json(
        {
          error: "Kindly provide valid entries for email and password!",
        },
        { status: 400 },
      );

    // Find existing user
    const userFromDB = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        team: true
      }
    });

    if (!userFromDB)
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 },
      );    

    const isCorrectPassword = await verifyPassword(
      password,
      userFromDB.password,
    );
    if(!isCorrectPassword) return NextResponse.json({
      error: "Invalid credentials"
    }, {status: 401})
  

    // Generate token
    const token = generateToken(userFromDB.id);
    const response = NextResponse.json({
      user: {
        id: userFromDB.id,
        name: userFromDB.name,
        email: userFromDB.email,
        role: userFromDB.role,
        team: userFromDB.team,
        teamId: userFromDB.teamId,
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
    console.error("Login failed", error);
    return NextResponse.json({
      message: `Internal server error, something went wrong!`,
    });
  }
}
