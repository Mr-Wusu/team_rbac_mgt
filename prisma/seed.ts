import "dotenv/config";

import { hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// Connection setup
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding to database begins...");

  // ✅ Explicit connection + warm-up (critical for Neon)
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;

  // ✅ Sequential team creation (NO Promise.all)
  const engineering = await prisma.team.create({
    data: {
      name: "Engineering",
      description: "Software development team",
      code: "ENG-2024",
    },
  });

  const marketing = await prisma.team.create({
    data: {
      name: "Marketing",
      description: "Marketing and Sales team",
      code: "MKT-2024",
    },
  });

  const operations = await prisma.team.create({
    data: {
      name: "Operations",
      description: "Business operations team",
      code: "OPS-2024",
    },
  });

  const sampleUsers = [
    {
      name: "Zebulon Uloego",
      email: "zebulon.uloego@yahoo.com",
      team: engineering,
      role: Role.MANAGER,
    },
    {
      name: "Nneoma Onyeforo",
      email: "nneoma.onyeforo@yahoo.com",
      team: engineering,
      role: Role.USER,
    },
    {
      name: "Eso Uchenna",
      email: "eso.uchenna@yahoo.com",
      team: engineering,
      role: Role.USER,
    },
    {
      name: "Chimamanda Nnaji",
      email: "chimamanda.nnaji@yahoo.com",
      team: engineering,
      role: Role.USER,
    },
    {
      name: "Susan Opara",
      email: "susan.opara@yahoo.com",
      team: marketing,
      role: Role.MANAGER,
    },
    {
      name: "Vivian Kpakol",
      email: "vivian.kpakol@yahoo.com",
      team: marketing,
      role: Role.USER,
    },
    {
      name: "Chinonso Nwokeji",
      email: "chinonso.nwokeji@yahoo.com",
      team: marketing,
      role: Role.USER,
    },
    {
      name: "Rachel Onwughalu",
      email: "rachel.onwughalu@yahoo.com",
      team: operations,
      role: Role.MANAGER,
    },
    {
      name: "Ijeoma Ekennah",
      email: "ijeoma.ekennah@yahoo.com",
      team: operations,
      role: Role.USER,
    },
    {
      name: "Eunice Ikenga",
      email: "eunice.ikenga@yahoo.com",
      team: operations,
      role: Role.USER,
    },
    {
      name: "Ogechi Uchegbuo",
      email: "ogechi.uchegbuo@yahoo.com",
      team: operations,
      role: Role.USER,
    },
  ];

  // ✅ Sequential user creation (stable under latency)
  for (const userData of sampleUsers) {
    await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: await hashPassword("#Pharcourt6"),
        role: userData.role,
        teamId: userData.team.id,
      },
    });
  }

  console.log("Seeding to database completed ✅");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
