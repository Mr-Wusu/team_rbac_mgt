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

  async function handleTeamAssignment(userId: string, teamId: string) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">Admin Dashboard</h1>
        <p className="text-slate-300">User and team management</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Users table with role and team assignment */}
        <div className="bg-slate-800 border border-700 rounded-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Users {users.length}</h3>
          </div>
        </div>
        {/* Team's table */}
      </div>
    </div>
  );
}
