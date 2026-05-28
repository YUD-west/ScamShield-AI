const { execSync } = require("child_process");
const path = require("path");

process.chdir(path.join(__dirname, ".."));

function run(cmd, optional) {
  console.log(">", cmd);
  try {
    execSync(cmd, { stdio: "inherit", shell: true });
  } catch {
    if (!optional) throw new Error(`Failed: ${cmd}`);
    console.warn("Skipped:", cmd);
  }
}

run('taskkill /F /IM node.exe 2>nul', true);
run("node scripts/fix-package-json.cjs");
run("node scripts/validate.cjs");

try {
  run("git rev-parse --git-dir");
} catch {
  run("git init");
  run("git branch -M main");
}

run("git remote remove origin", true);
run("git remote add origin https://github.com/Ethiopian-Cursor-Community/scamshield-ai.git", true);

run("git add -A");
run('git commit -m "ScamShield AI v3 - clean demo build"', true);

try {
  run("git push -u origin main");
} catch {
  run("git pull origin main --rebase --allow-unrelated-histories", true);
  run("git push -u origin main");
}

console.log("\nhttps://github.com/Ethiopian-Cursor-Community/scamshield-ai\n");
