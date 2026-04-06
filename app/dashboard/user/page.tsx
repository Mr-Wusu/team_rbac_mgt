import UserDashboard from "@/app/_component/dashboard/UserDashboard";
import { getCurrentuser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const user = await getCurrentuser();
  if (!user) {
    redirect("/login");
  }

  // Fetch user's team members with specific data
  const teamMembers = user.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })
    : [];

  return <UserDashboard teamMembers={teamMembers} currentUser={user} />;
}
