const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

process.chdir(path.join(__dirname, ".."));

let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log("OK  ", name);
  } catch (e) {
    console.error("FAIL", name, "-", e.message);
    failed++;
  }
}

check("package.json (no BOM)", () => {
  const raw = fs.readFileSync("package.json");
  if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
    throw new Error("UTF-8 BOM detected — run: node scripts/fix-package-json.cjs");
  }
  JSON.parse(raw.toString("utf8"));
});

check("prisma schema", () => {
  const s = fs.readFileSync("prisma/schema.prisma", "utf8");
  if (s.includes("@db.Text")) throw new Error("Remove @db.Text for SQLite");
  const bad = [
    "content   String    keywords",
    "refresh_token     String?  access_token",
    "input       String     scamProbability",
    "aiSummary             String    recommendedActions",
  ];
  for (const line of bad) {
    if (s.includes(line)) throw new Error(`Corrupted schema line: ${line}`);
  }
});

check(".env.example", () => {
  const ex = fs.readFileSync(".env.example", "utf8");
  for (const k of ["AUTH_SECRET", "DATABASE_URL", "NEXT_PUBLIC_APP_URL"]) {
    if (!ex.includes(k)) throw new Error(`Missing ${k}`);
  }
});

check("prisma validate", () => {
  execSync("npx prisma validate", { stdio: "pipe" });
});

console.log(failed ? `\n${failed} failed\n` : "\nAll checks passed\n");
process.exit(failed ? 1 : 0);
