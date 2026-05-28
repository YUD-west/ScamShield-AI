const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("\n[scamshield] Database setup...\n");

try {
  execSync("npx prisma generate", { stdio: "inherit" });
} catch {
  console.warn("[scamshield] prisma generate skipped (close dev server if EPERM)");
}

execSync("npx prisma db push", { stdio: "inherit" });

try {
  execSync("npm run db:seed", { stdio: "inherit" });
} catch {
  console.warn("[scamshield] Seed skipped");
}

const url = process.env.DATABASE_URL || "file:./prisma/scamshield.db";
if (url.startsWith("file:")) {
  const rel = url.replace(/^file:/, "").replace(/^\//, "");
  const dbPath = path.join(process.cwd(), rel);
  if (fs.existsSync(dbPath)) {
    console.log("\n[scamshield] Database ready:", dbPath, "\n");
  }
}
console.log("\n[scamshield] Done.\n");
