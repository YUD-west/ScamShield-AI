import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SCAM_KNOWLEDGE } from "../src/ai-engine/rag/knowledge-base";

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    {
      email: "demo@scamshield.ai",
      name: "Demo User",
      password: "Demo1234!",
      role: "user",
    },
    {
      email: "admin@scamshield.ai",
      name: "Admin User",
      password: "Admin1234!",
      role: "admin",
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
      },
    });
    console.log(`User: ${u.email} (${u.role})`);
  }
}

async function seedKnowledge() {
  for (const chunk of SCAM_KNOWLEDGE) {
    await prisma.scamKnowledge.upsert({
      where: { id: chunk.id },
      create: {
        id: chunk.id,
        category: chunk.category,
        title: chunk.title,
        content: chunk.content,
        keywords: chunk.keywords,
      },
      update: {
        content: chunk.content,
        keywords: chunk.keywords,
      },
    });
  }
  console.log(`Seeded ${SCAM_KNOWLEDGE.length} knowledge chunks`);
}

async function main() {
  await seedUsers();
  await seedKnowledge();
  console.log("Database seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
