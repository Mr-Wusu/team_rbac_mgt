import { redirect } from "next/navigation";

import { Role } from "../types";
import { getCurrentuser } from "../lib/auth";

export default async function DashboardLayout() {
  
  const user = await getCurrentuser()
  
  if (!user) redirect("/login");

  // Redirect based on user role
  switch (user.role) {
    case Role.ADMIN:
      redirect("/dashboard/admin");
    case Role.MANAGER:
      redirect("/dashboard/manager");
    case Role.USER:
      redirect("/dashboard/user");
    default:
      redirect("/dashboard/user");
  }
}
