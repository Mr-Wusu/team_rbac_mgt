
import ManagerDashboard from "@/app/_component/dashboard/ManagerDashboard";
import { checkUserPermission, getCurrentuser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

export default async function ManagerPage() {
  const user = await getCurrentuser();
  if (!user || !checkUserPermission(user, Role.MANAGER)) {
    redirect("/unauthorized");
  }

  const [myTeamMembers, otherTeamMembers] = await Promise.all([
    user.teamId
      ? prisma.user.findMany({
          where: { teamId: user.teamId, role: { not: Role.ADMIN } },
          include: { team: true },
          orderBy: [{ teamId: "desc" }, { name: "asc" }],
        })
      : Promise.resolve([]), // ✅ returns Promise<never[]> — consistent type
    prisma.user.findMany({
      where: { teamId: { not: user.teamId }, role: { not: Role.ADMIN } },
      include: {
        team: {
          select: { id: true, name: true, code: true, description: true },
        },
      },
      orderBy: [{ teamId: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <ManagerDashboard
      myTeamMembers={myTeamMembers}
      otherTeamMembers={otherTeamMembers}
      currentUser={user}
    />
  );
}
