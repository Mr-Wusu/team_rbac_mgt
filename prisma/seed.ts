import { hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding to database begins...")
  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Engineering",
        description: "Software development team",
        code: "ENG-2024"
      }
    }), 
    prisma.team.create({
      data: {
        name: "Marketing",
        description: "Marketing and Sales team",
        code: "MKT-2024"
      }
    }), 
    prisma.team.create({
      data: {
        name: "Operations",
        description: "Business operations team",
        code: "OPS-2024"
      }
    })
  ])

  // Create sample users
  const sampleUsers = [
    {
      name: "Zebulon Uloego",
      email: "zebulon.uloego@yahoo.com",
      team: teams[0],
      role: Role.MANAGER,
    },
    {
      name: "Nneoma Onyeforo",
      email: "nneoma.onyeforo@yahoo.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "Eso Uchenna",
      email: "eso.uchenna@yahoo.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "Chimamanda Nnaji",
      email: "chimamanda.nnaji@yahoo.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "Susan Opara",
      email: "susan.opara@yahoo.com",
      team: teams[1],
      role: Role.MANAGER,
    },
    {
      name: "Vivian Kpakol",
      email: "vivian.kpakol@yahoo.com",
      team: teams[1],
      role: Role.USER,
    },
    {
      name: "Chinonso Nwokeji",
      email: "chinonso.nwokeji@yahoo.com",
      team: teams[1],
      role: Role.USER,
    },
    {
      name: "Rachel Onwughalu",
      email: "rachel.onwughalu@yahoo.com",
      team: teams[2],
      role: Role.MANAGER,
    },
    {
      name: "Ijeoma Ekennah",
      email: "ijeoma.ekennah@yahoo.com",
      team: teams[2],
      role: Role.USER,
    },
    {
      name: "Eunice Ikenga",
      email: "eunice.ikenga@yahoo.com",
      team: teams[2],
      role: Role.USER,
    },
    {
      name: "Ogechi Uchegbuo",
      email: "ogechi.uchegbuo@yahoo.com",
      team: teams[2],
      role: Role.USER,
    },
  ];
  
  for(const userData of sampleUsers) {
    await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: await hashPassword("#Pharcourt6"),
        role: userData.role,
        teamId: userData.team.id,
      }
    })
  }
  console.log("Seeding to database completed ✅")
}

main().catch((e)=>{
  console.error("❌ Seeding failed", e)
  process.exit(1)
}).finally(async()=> await prisma.$disconnect())