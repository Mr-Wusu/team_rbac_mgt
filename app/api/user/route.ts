import { getCurrentuser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { Prisma } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(Request: NextRequest) {
  try {
    const user = await getCurrentuser();
    if (!user)
      return NextResponse.json(
        {
          error: "You are not authorized to access user information!",
        },
        { status: 401 },
      );
    const searchParams = Request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    // Build where clause based on user role
    const where: Prisma.UserWhereInput = {};
    if (user.role === Role.ADMIN) {
      // Admin can see all users
    } else if (user.role === Role.MANAGER) {
      // Managers can see all users in their team and in cross teams but not cross team managers
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      // Regular users can only see their team
      where.AND = [{ teamId: user.teamId }, { role: { not: Role.ADMIN } }];
    }

    // Additional filters
    if (teamId) where.teamId = teamId;
    if (role) where.role = role as Role;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({
      error: "Internal server error! Something went wrong!",
    }, {status: 500});
  }
}
