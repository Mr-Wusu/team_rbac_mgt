import { Prisma } from "@/generated/prisma";

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
  GUEST = "GUEST",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  teamId?: string;
  team?: Team;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  code: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (formData: FormData) => void;
  logout: () => void;
  hasPermission: (requiredRole: Role) => boolean
}

// User with their team relation included
export type UserWithTeam = Prisma.UserGetPayload<{
  include: { team: true };
}>;

// User with only partial team fields (for cross-team view)
export type UserWithPartialTeam = Prisma.UserGetPayload<{
  include: {
    team: {
      select: { id: true; name: true; code: true; description: true };
    };
  };
}>;

// Team with its members (partial member fields)
export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    members: {
      select: { id: true; name: true; role: true; email: true };
    };
  };
}>;