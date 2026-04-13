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

  const allTeamMembers = [...otherTeamMembers, ...myTeamMembers].filter(
    (user) => user.role !== "MANAGER",
  );

  const managers = [...otherTeamMembers, ...myTeamMembers].filter((user)=> (user.role === "MANAGER" && user.id !== currentUser.id))

  const teamMembers = myTeamMembers.filter((member)=> member.role !== "MANAGER")

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">
          Manager&apos;s Dashboard
        </h1>
        <p className="text-slate-300">Team management view</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Column 1 - All Team members */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg h-fit">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              All teams members: {allTeamMembers.length}
            </h3>
          </div>
          <div className="p-4">
            {allTeamMembers.map((member) => (
              <div
                key={member.id}
                className="border-b border-slate-700 py-2 last:border-b-0"
              >
                <p className="font-medium text-white">{member.name}</p>
                <p className="text-sm text-slate-400">
                  {member.email} 🔸 {member.role} 🔸 {member.team?.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - My Team members + Other Managers stacked */}
        <div className="flex flex-col gap-6">
          {/* My Team members */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg h-fit">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white">
                My team members: {teamMembers.length}
              </h3>
            </div>
            <div className="p-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="border-b border-slate-700 py-2 last:border-b-0"
                >
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-sm text-slate-400">
                    {member.email} 🔸 {member.role} 🔸 {member.team?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Managers */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg h-fit">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white">
                Other managers: {managers.length}
              </h3>
            </div>
            <div className="p-4">
              {managers.map((member) => (
                <div
                  key={member.id}
                  className="border-b border-slate-700 py-2 last:border-b-0"
                >
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-sm text-slate-400">
                    {member.email} 🔸 {member.role} 🔸 {member.team?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
