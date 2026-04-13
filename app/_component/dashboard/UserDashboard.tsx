import { User } from "@/app/types";

type TeamMemberPreview = {
  id: string;
  name: string;
  email: string;
  role: string;
};

interface UserDashboardProps {
  myTeamMembers: TeamMemberPreview[];
  currentUser: User;
}
export default function UserDashboard({
  myTeamMembers,
  currentUser,
}: UserDashboardProps) {
  const teamMembers = myTeamMembers.filter(
    (member) => member.role !== "MANAGER" && member.id !== currentUser.id,
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">
          User&apos;s Dashboard
        </h1>
        <p className="text-slate-300">Welcome {currentUser.name}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Column 1 - All Team members */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg h-fit">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              My team members: {teamMembers.length} (excluding me)
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
                  {member.email} 🔸 {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
