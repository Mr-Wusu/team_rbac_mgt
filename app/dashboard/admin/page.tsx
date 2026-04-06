import AdminDashboard from "@/app/_component/dashboard/AdminDashboard";
import { checkUserPermission, getCurrentuser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";


export default async function AdminPage(){
  const user = await getCurrentuser()
  if(!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect("/unauthorized")
  }

  // Fetch data for admin password
  const [prismaUsers, prismaTeams] = await Promise.all([
    prisma.user.findMany({
      include: {
        team: true
      },
      orderBy: {createdAt: "desc"}
    }),
    prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          }
        }
      }
    })
  ])

  return (
    <AdminDashboard
      users={prismaUsers}
      teams={prismaTeams}
      currentUser={user}
    />
  );
}