import { User, UserWithPartialTeam, UserWithTeam } from "@/app/types";

interface ManagerDashboardProps {
  myTeamMembers: UserWithTeam[];
  otherTeamMembers: UserWithPartialTeam[];
  currentUser: User;
}
export default function ManagerDashboard({
  myTeamMembers,
  otherTeamMembers,
  currentUser,
}: ManagerDashboardProps) {
  console.log(myTeamMembers, otherTeamMembers, currentUser);

  return <div></div>;
}
