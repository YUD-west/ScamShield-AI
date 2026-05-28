const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "package.json");
let raw = fs.readFileSync(file);

if (raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
  raw = raw.slice(3);
}

const pkg = JSON.parse(raw.toString("utf8"));

pkg.scripts = {
  dev: "node scripts/kill-port.cjs && next dev -p 3011",
  build: "prisma generate && next build",
  start: "next start -p 3011",
  lint: "next lint",
  "db:setup": "node scripts/setup-db.cjs",
  "db:push": "prisma db push",
  "db:seed": "tsx prisma/seed.ts",
  validate: "node scripts/validate.cjs",
};

fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log("package.json fixed (no BOM)");
