"use client";
import apiClient from "@/app/lib/apiClient";
import { Role, TeamWithMembers, UserWithTeam } from "@/app/types";
import { User } from "@/app/types";
import { useTransition } from "react";

interface AdminDashboardProps {
  users: UserWithTeam[];
  teams: TeamWithMembers[];
  currentUser: User;
}

export default function AdminDashboard({
  users,
  teams,
  currentUser,
}: AdminDashboardProps) {
  const [isPending, startTransition] = useTransition();

  async function handleTeamAssignment(userId: string, teamId: string | null) {
    startTransition(async () => {
      try {
        await apiClient.assignUserToTeam(userId, teamId);
        window.location.reload();
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Error updating team assignment!",
        );
      }
    });
  }

  async function handleRoleAssignment(userId: string, newRole: Role) {
    if (userId === currentUser.id)
      return alert("You cannot change your own role");
    startTransition(async () => {
      try {
        await apiClient.updateUserRole(userId, newRole);
        window.location.reload();
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Error updating role change",
        );
      }
    });
  }

  const ordinaryUsers = users.filter(
    (user) => user.role === "USER",
  );
  const managers = users.filter(
    (user) => user.role === "MANAGER",
  );

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">Admin Dashboard</h1>
        <p className="text-slate-300">User and team management</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Users table with role and team assignment */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              Users: {users.length} (including Admin and Managers)
            </h3>
            <p className="text-slate-400 text-sm">
              Manage roles and team assignment
            </p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Role</th>
                  <th className="text-left py-2 text-slate-300">Team</th>
                  <th className="text-left py-2 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700">
                    <td className="py-2 text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="items-center justify-center text-white text-xs flex rounded-full bg-blue-500 h-6 w-6">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p>{user.name}</p>
                          <p className="text-slate-500 text-xm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleAssignment(user.id, e.target.value as Role)
                        }
                        disabled={isPending || user.id === currentUser.id}
                        className=" appearance-none px-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900 border border-slate-700 rounded-lg py-1 "
                      >
                        <option value={Role.USER}>USER</option>
                        <option value={Role.MANAGER}>MANAGER</option>
                        <option value={Role.ADMIN}>ADMIN</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <select
                        value={user.teamId || ""}
                        onChange={(e) =>
                          handleTeamAssignment(user.id, e.target.value || null)
                        }
                        disabled={isPending}
                        className=" appearance-none px-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900 border border-slate-700 rounded-lg py-1"
                      >
                        <option value="">No Team</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      {user.team && (
                        <span className="text-xs text-slate-500 ml-3">
                          {user.team.code}
                        </span>
                      )}
                    </td>
                    <td className="py-2">
                      {user.teamId && (
                        <button
                          onClick={() => handleTeamAssignment(user.id, null)}
                          disabled={isPending}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Team's table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Teams: {teams.length}</h3>
            <p className="text-slate-400 text-sm">Team Overview</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300">Name</th>
                  <th className="text-left py-2 text-slate-300">Code</th>
                  <th className="text-left py-2 text-slate-300">Members</th>
                  <th className="text-left py-2 text-slate-300">Managers</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const teamMembers = team.members;
                  const teamManagers = teamMembers.filter(
                    (member) => member.role === Role.MANAGER,
                  );

                  return (
                    <tr key={team.id} className="border-b border-slate-700">
                      <td className="py-2 text-slate-300 font-medium">
                        {team.name}
                      </td>
                      <td className="py-2">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                          {team.code}
                        </span>
                      </td>
                      <td className="py-2 text-slate-300">
                        {teamMembers.length} users
                      </td>
                      <td className="py-2 text-slate-300">
                        {teamManagers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teamManagers.map((manager) => (
                              <span
                                key={manager.id}
                                className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                              >
                                {manager.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            No manager
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 fixed bottom-0 w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-sm text-slate-400">Total Users</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-sm text-slate-400">Admin</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{managers.length}</p>
          <p className="text-sm text-slate-400">Managers</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">
            {ordinaryUsers.length}
          </p>
          <p className="text-sm text-slate-400">Users</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{teams.length}</p>
          <p className="text-sm text-slate-400">Teams</p>
        </div>
      </div>
    </div>
  );
}
