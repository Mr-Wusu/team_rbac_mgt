import { checkUserPermission, getCurrentuser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const currentUser = await getCurrentuser();

    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to assign teams",
        },
        { status: 403 },
      );
    }

    // Prevent users from changing their own role
    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You cannot change your own role",
        },
        { status: 403 },
      );
    }

    const { role } = await request.json();
    
    // Validate role
    const validateRoles = [Role.USER, Role.MANAGER];
    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role or you cannot have more than one Admin role user",
        },
        { status: 404 },
      );
    }

    // If user has no team role should not be changed. First be in a team

    // Update team assignment
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: `User role updated to ${role} successfully!`,
    });
  } catch (error) {
    console.error("Role assignment error", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        error: "Internal server error! Something went wrong!",
      },
      { status: 500 },
    );
  }
}
